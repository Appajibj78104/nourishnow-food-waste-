const NGO = require('../models/NGO');
const Donation = require('../models/Donation');

class RecommendationService {
    static async getDonationRecommendations(ngoId) {
        try {
            const ngo = await NGO.findById(ngoId);
            if (!ngo) throw new Error('NGO not found');

            // Get NGO's preferences and history
            const pastDonations = await Donation.find({ 
                assignedTo: ngoId,
                status: 'completed'
            }).sort('-createdAt').limit(50);

            // Calculate preference scores
            const preferences = this.calculatePreferences(pastDonations);

            // Get available donations
            const availableDonations = await Donation.find({
                status: 'available',
                location: {
                    $near: {
                        $geometry: ngo.location,
                        $maxDistance: 10000 // 10km radius
                    }
                }
            });

            // Score and rank donations
            const scoredDonations = availableDonations.map(donation => ({
                donation,
                score: this.calculateMatchScore(donation, preferences, ngo)
            }));

            // Sort by score and return top recommendations
            return scoredDonations
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map(item => item.donation);

        } catch (error) {
            console.error('Recommendation Error:', error);
            throw error;
        }
    }

    static calculatePreferences(pastDonations) {
        // Analyze past donation patterns
        const preferences = {
            foodTypes: {},
            quantities: [],
            timePatterns: {},
            successRate: {}
        };

        pastDonations.forEach(donation => {
            // Track food type preferences
            preferences.foodTypes[donation.type] = 
                (preferences.foodTypes[donation.type] || 0) + 1;

            // Track quantity patterns
            preferences.quantities.push(donation.quantity);

            // Track time patterns
            const hour = new Date(donation.pickupTime).getHours();
            preferences.timePatterns[hour] = 
                (preferences.timePatterns[hour] || 0) + 1;

            // Track success with donors
            preferences.successRate[donation.donorId] = 
                (preferences.successRate[donation.donorId] || 0) + 1;
        });

        return preferences;
    }

    static calculateMatchScore(donation, preferences, ngo) {
        let score = 0;

        // Food type match
        if (preferences.foodTypes[donation.type]) {
            score += (preferences.foodTypes[donation.type] / 
                     Object.values(preferences.foodTypes).reduce((a, b) => a + b, 0)) * 40;
        }

        // Quantity suitability
        const avgQuantity = preferences.quantities.reduce((a, b) => a + b, 0) / 
                          preferences.quantities.length;
        const quantityDiff = Math.abs(donation.quantity - avgQuantity);
        score += (1 - quantityDiff/avgQuantity) * 20;

        // Time preference
        const donationHour = new Date(donation.pickupTime).getHours();
        if (preferences.timePatterns[donationHour]) {
            score += (preferences.timePatterns[donationHour] / 
                     Object.values(preferences.timePatterns).reduce((a, b) => a + b, 0)) * 20;
        }

        // Distance factor
        const distance = this.calculateDistance(
            donation.location.coordinates,
            ngo.location.coordinates
        );
        score += (1 - distance/10000) * 20; // 10km max distance

        return score;
    }

    static calculateDistance(coord1, coord2) {
        // Haversine formula for distance calculation
        const R = 6371e3; // Earth's radius in meters
        const φ1 = coord1[1] * Math.PI/180;
        const φ2 = coord2[1] * Math.PI/180;
        const Δφ = (coord2[1] - coord1[1]) * Math.PI/180;
        const Δλ = (coord2[0] - coord1[0]) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                 Math.cos(φ1) * Math.cos(φ2) *
                 Math.sin(Δλ/2) * Math.sin(Δλ/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }
}

module.exports = RecommendationService; 
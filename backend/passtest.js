const bcrypt = require('bcrypt');

// Test password hashing and comparison
const testPassword = async () => {
    const password = 'password356'; // Example password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Password:', password);
    console.log('Hashed Password:', hashedPassword);

    // Simulate comparing the entered password with the stored hash
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Password Match:', isValid);  // Should log true
};

// Call the testPassword function
testPassword();

const fs = require('fs');
const path = require('path');

console.log('Checking dependencies...');

// Check if node_modules exists
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('✓ node_modules directory exists');
  
  // Check if react-native-web exists
  if (fs.existsSync(path.join(__dirname, 'node_modules', 'react-native-web'))) {
    console.log('✓ react-native-web is installed');
  } else {
    console.log('✗ react-native-web is NOT installed');
  }
  
  // Check if firebase exists
  if (fs.existsSync(path.join(__dirname, 'node_modules', 'firebase'))) {
    console.log('✓ firebase is installed');
  } else {
    console.log('✗ firebase is NOT installed');
  }
} else {
  console.log('✗ node_modules directory does not exist');
}

console.log('Done.');
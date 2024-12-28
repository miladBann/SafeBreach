// Function to generate a unique color based on deviceId using HSL
export const getDeviceColor = (deviceId) => {
    // Convert the device ID to a hash value
    const hash = Math.abs(deviceId.hashCode());
  
    // Generate a color based on the hash value
    const hue = hash % 360; // Hue value for HSL, range 0-360
    const saturation = 70;
    const lightness = 50; 
  
    // Return the color in HSL format
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
  
  // Add a method to string to generate a hash for deviceId
  String.prototype.hashCode = function () {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
      const char = this.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash; // Convert to 32bit integer
    }
    return hash;
  };
  
import styles from '@/stylesheets/sign-in-stylesheet';
import { Image, Text, TouchableOpacity } from 'react-native';

const SocialLoginButtons: React.FC = () => {
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login pressed');
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple login pressed');
  };

  return (
    <>
      <TouchableOpacity style={styles.SocialSIgninButton} onPress={handleGoogleLogin}>
        <Image
          source={require('../../assets/images/google.png')}
          style={{
            height: 25,
            width: 25,
          }}
        />
        <Text style={styles.Google}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.AppleSocialSIgninButton} onPress={handleAppleLogin}>
        <Image
          source={require('../../assets/images/apple.png')}
          style={{
            height: 35,
            width: 35,
          }}
        />
        <Text style={styles.Google}>Continue with Apple</Text>
      </TouchableOpacity>
    </>
  );
};

export default SocialLoginButtons;


import styles from "@/stylesheets/promotional-image-stylesheet";
import React from "react";
import { Image, ImageBackground, Platform, Text, View } from "react-native";
import ViewShot from "react-native-view-shot";



type PromotionalImageProps = {
  website: string;
};

export const PromotionalImage = React.forwardRef<View | null, PromotionalImageProps>(
  ({ website }, ref) => {
    return (
      <ViewShot ref={ref} options={{ format: "png", quality: 1 }}>
        {Platform.OS === "ios" ? (
          <ImageBackground
          style={styles.bg}
          resizeMode="cover"
          source={require("../assets/images/sharebg.jpg")}
        >
          
          <View style={styles.overlay} />

          
          <View style={styles.iosCard}>
            
            <Text style={styles.iostagline}>
              Website Audit Completed!
            </Text>

            
            <Text style={styles.iosMainTitle}>
              Upgrade Your Website
            </Text>

            
            <Text style={styles.iosSubText}>
              I just audited my website using{" "}
              <Text style={styles.brandAccent}>Sitelytics </Text>  
               and the insights were amazing!
            </Text>

            
            <View style={styles.iosWebsiteBox}>
              <Text style={styles.websiteLabel}>Analyzed Website</Text>
              <Text style={styles.websiteValue}>{website}</Text>
            </View>

            
            <View style={styles.iosDownloadBox}>
              <Text style={styles.iosDownloadText}>
                Get the Sitelytics App for Free
              </Text>

              <View style={styles.iosStoreRow}>
                
                <View style={styles.storeBadge}>
                  <Image 
                    source={require('../assets/images/googlePlay.png')} 
                    style={styles. googlePlayDownloadImage}
                  />
                  <View>
                    <Text style={styles.getOn}> GET IT ON</Text>
                    <Text style={styles.storeText}> Google Play</Text>
                  </View>
                </View>

                <View style={styles.storeBadge}>
                  <Image 
                    source={require('../assets/images/whiteApple.png')} 
                    style={styles.downloadImage}
                  />
                   <View>
                      <Text style={styles.getOn}> Download on the </Text>
                      <Text style={styles.storeText}> Apple Store</Text>
                  </View>
                </View>
              </View>
            </View>

       
            <Text style={styles.iosFooter}>
              Sitelytics: AI-Powered Website Scanner
            </Text>
          </View>
        </ImageBackground>
        ) : (

        <ImageBackground
          style={styles.bg}
          resizeMode="cover"
          source={require("../assets/images/sharebg.jpg")}
        >
          
          <View style={styles.overlay} />

          
          <View style={styles.card}>
            
            <Text style={styles.tagline}>
              Website Audit Completed!
            </Text>

            
            <Text style={styles.mainTitle}>
              Upgrade Your Website
            </Text>

            
            <Text style={styles.subText}>
              I just audited my website using{" "}
              <Text style={styles.brandAccent}>Sitelytics </Text>  
               and the insights were amazing!
            </Text>

            
            <View style={styles.websiteBox}>
              <Text style={styles.websiteLabel}>Analyzed Website</Text>
              <Text style={styles.websiteValue}>{website}</Text>
            </View>

            
            <View style={styles.downloadBox}>
              <Text style={styles.downloadText}>
                Get the Sitelytics App for Free
              </Text>

              <View style={styles.storeRow}>
                
                <View style={styles.storeBadge}>
                  <Image 
                    source={require('../assets/images/googlePlay.png')} 
                    style={styles. googlePlayDownloadImage}
                  />
                  <View>
                    <Text style={styles.getOn}> GET IT ON</Text>
                    <Text style={styles.storeText}> Google Play</Text>
                  </View>
                </View>

                <View style={styles.storeBadge}>
                  <Image 
                    source={require('../assets/images/whiteApple.png')} 
                    style={styles.downloadImage}
                  />
                   <View>
                      <Text style={styles.getOn}> Download on the </Text>
                      <Text style={styles.storeText}> Apple Store</Text>
                  </View>
                </View>
              </View>
            </View>

       
            <Text style={styles.footer}>
              Sitelytics: AI-Powered Website Scanner
            </Text>
          </View>
        </ImageBackground>
        )}
      </ViewShot>
    );
  }
);

PromotionalImage.displayName = "PromotionalImage";


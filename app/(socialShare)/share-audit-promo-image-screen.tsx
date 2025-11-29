import { PromotionalImage } from "@/components/promotional-image";
import styles from "@/stylesheets/share-audit-promo-image-screen-stylesheet";
import { Feather } from "@expo/vector-icons";
import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";







export default function ShareAuditPromoImageScreen() {
  const { t } = useTranslation();
  const screenshotRef = useRef<View>(null);
  const inset = useSafeAreaInsets();

  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter();
  const params = useLocalSearchParams<{ website?: string }>();
  const website = params.website ?? "";



  const takeScreenshotAndShare = async () => {
    if (!screenshotRef.current) return;
    setLoading(true);

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: t('share.permissionNeeded'),
        });
        return;
      }

      const base64 = await captureRef(screenshotRef.current, {
        format: "png",
        quality: 1,
        result: "base64",
        width: 800,
        height: 1050,
      });

      const filename = `audit-${Date.now()}.png`;
      let fileUri = "";

      if (Platform.OS === "android") {
        const file = new File(Paths.cache, filename);
        file.create();
        await file.write(base64, { encoding: "base64" });

        fileUri = file.uri;

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const album = await MediaLibrary.getAlbumAsync("Sitelytics");
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
        } else {
          await MediaLibrary.createAlbumAsync("Sitelytics", asset, false);
        }
      } else {

        const file = new File(Paths.cache, filename);
        file.create();

        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        await file.write(bytes);
        fileUri = file.uri;
      }

      await Sharing.shareAsync(fileUri);

    } catch (err) {
      console.log("Share error:", err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        paddingTop: inset.top + 10,

      }}
    >

      <PromotionalImage ref={screenshotRef} website={website} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/')}>
          <Text style={styles.buttonText}>{t('share.backToHome')}</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator
            size={"large"}
            color={"#FF5A3D"}
            style={styles.activityIndicator}
          />
        ) : (
          <TouchableOpacity style={styles.shareButtonContainer}
            onPress={takeScreenshotAndShare}
          >
            <Feather name="share-2" size={18} color="#FF5A3D" />
            <Text style={styles.shareButtonText}>{t('common.share')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ marginBottom: 100 }} />
    </ScrollView>
  );
}




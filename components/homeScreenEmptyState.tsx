import styles from "@/stylesheets/homeScreenEmptyStateStylesheet";
import { useTranslation } from "@/utils/translations";
import { Image, Text, View } from "react-native";

export default function EmptyState() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/empty.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>{t('emptyState.noRecentAudit')}</Text>
    </View>
  );
}


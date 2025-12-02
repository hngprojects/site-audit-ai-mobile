import styles from "@/stylesheets/auditResultCardStylesheet";
import { AuditResultCardProps } from "@/type";
import { useTranslation } from "@/utils/translations";
import { Text, View } from "react-native";



export default function AuditResultCard({ url, status, score, time }: AuditResultCardProps) {
  const { t } = useTranslation();
  const pillColor =
    status === "Passed"
      ? "rgba(76, 175, 80, 0.25)"
      : status === "Average"
        ? "rgba(255, 193, 7, 0.15)"
        : "rgba(211, 47, 47, 0.25)";

  const getStatusLabel = () => {
    if (status === "Passed") return t('status.passed');
    if (status === "Average") return t('status.average');
    return t('status.failed');
  };

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.url}>{url}</Text>
        <Text style={styles.score}>{t('auditResultCard.score')}: {score}/100</Text>
        <Text style={styles.time}>{time} {t('auditResultCard.hoursAgo')}</Text>

      </View>

      <View style={[styles.statusPill, { backgroundColor: pillColor }]}>
        <Text style={[styles.statusText,
        {
          color: status === "Passed" ? "#4CAF50"
            : status === "Average" ? "#FFC107"
              : "#D32F2F"
        }
        ]}>
          {getStatusLabel()}
        </Text>
      </View>
    </View>
  );
}


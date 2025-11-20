import styles from "@/Stylesheets/auditResultCardStylesheet";
import { AuditResultCardProps } from "@/type";
import React from "react";
import { Text, View } from "react-native";



export default function AuditResultCard({ url, status, score, time }: AuditResultCardProps) {
  const pillColor =
    status === "Passed"
      ? "rgba(76, 175, 80, 0.25)"
      : status === "Average"
      ? "rgba(255, 193, 7, 0.15)"
      : "rgba(211, 47, 47, 0.25)";

  return (
    <View style={styles.card}>
        <View>
            <Text style={styles.url}>{url}</Text>
            <Text style={styles.score}>Score: {score}/100</Text>
            <Text style={styles.time}>{time} hours ago</Text>

        </View>

      <View style={[styles.statusPill, { backgroundColor: pillColor }]}>
        <Text style={[styles.statusText,
            {color: status === "Passed" ? "#4CAF50" 
                : status === "Average" ? "#FFC107"
            : "#D32F2F"}
        ]}>
            {status}
        </Text>
      </View>
    </View>
  );
}


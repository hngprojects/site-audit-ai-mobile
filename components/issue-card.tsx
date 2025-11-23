import styles from "@/stylesheets/issue-card-stylesheet";
import { IssueCardProps } from "@/type";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";



const colorForStatus = (s?: string) =>
  s === "Critical" ? "#F04438" : s === "Warning" ? "#F59E0B" : s === "Good" ? "#0EA472" : "#6B7280";

export default function IssueCard({
  title = "Untitled",
  score,
  status,
  description,
  noIssuesLabel,
  onPressDetails,
}: IssueCardProps) {
  const hasIssues = !!description && description.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.checkbox}>▢</Text>
      </View>

      <View style={styles.middle}>
        <Text style={styles.issueTitle}>{title}</Text>

        {score != null ? (
          <Text style={styles.issueScore}>
            Score: <Text style={{ fontWeight: "700" }}>{score}/100</Text>
          </Text>
        ) : null}

        <Text style={styles.issueDesc}>{hasIssues ? description : noIssuesLabel ?? "No issues found"}</Text>

        <TouchableOpacity onPress={onPressDetails} activeOpacity={0.7}>
            <View style={styles.viewDetailsInnerWrap}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <FontAwesome6 name="arrow-right-long" size={18} color="#3F5BD9" style={styles.viewDetailsArrow}/>
                    </View>
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
        {status ? (
          <View style={[styles.badge, { borderColor: colorForStatus(status),}]}>
            <Text style={[styles.badgeText, ]}>{status}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

import { useSelectedIssuesStore } from "@/store/audit-summary-selected-issue-store";
import styles from "@/stylesheets/issue-card-stylesheet";
import { IssueCardProps } from "@/type";
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";





export default function IssueCard({
  id,
  title = "Untitled",
  score,
  status,
  description,
  noIssuesLabel,
  onPressDetails
}: IssueCardProps) {
  const hasIssues = !!description && description.length > 0;


  const numericScore = Number(score);

const scoreStatus =
  numericScore <= 49 ? "Critical" :
  numericScore <= 69 ? "Warning" :
  "Good";



  const statusLabel =
  scoreStatus === "Good"
    ? "Good"
    : scoreStatus === "Warning"
    ? "Warning"
    : "Critical";



    const pillColor =
      scoreStatus === "Good"
      ? "rgba(14, 164, 114, 0.20)"   
      : scoreStatus === "Warning"
      ? "rgba(255, 155, 46, 0.20)"   
      : "rgba(215, 45, 45, 0.20)";   


      const pillTextColor =
        scoreStatus === "Good"
        ? "#0EA472"
        : scoreStatus === "Warning"
        ? "#FF9B2E"
        : "#D72D2D";




  const { issues, addIssue, removeIssue } = useSelectedIssuesStore();

  
  const toggleSelect = () => {
    if (isSelected) {
      removeIssue(id);   
    } else {
      addIssue({
        id,
        title,
        score,
        status,
        description,
      });
    }
  };

  const isSelected = issues.some((issue) => issue.id === id);

  return (
    <View style={styles.card}>
      <View style={styles.middle}>
        <View style={styles.cardTitlesection}>
           <TouchableOpacity onPress={toggleSelect}>
              {isSelected ? (
                <Ionicons name="checkbox" size={24} color="#e24017ff" />
              ) : (
                <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="black" />
              )}
            </TouchableOpacity>
          <Text style={styles.issueTitle}>{title}</Text>
        </View>

        {score != null ? (
          <Text style={styles.issueScore}>
            Score: <Text style={{ fontWeight: "700" }}>{score}/100</Text>
          </Text>
        ) : null}

        <Text style={styles.issueDesc}>{hasIssues ? description : noIssuesLabel ?? "No issues found"}</Text>

        <TouchableOpacity onPress={onPressDetails} >
           <View style={styles.viewDetailContainer}>
              <Text style={styles.viewDetailsText}> 
                View Detail
              </Text>
              <FontAwesome6 name="arrow-right-long" size={18} color="#3F5BD9" style={styles.viewDetailsArrow}/>
           </View>
        </TouchableOpacity>
      </View>


      <View style={styles.right}>
        {statusLabel ? (
          <View 
            style={[styles.statusPill, { backgroundColor: pillColor }]}
          >
            <Text 
              style={[styles.statusText, { color: pillTextColor }]}
            >
              {statusLabel}
            </Text>
          </View>

        ) : null}
      </View>
    </View>
  );
}

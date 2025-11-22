import { ReportItemProps, Status } from "@/type";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from "react";
import {
    Text,
    TouchableOpacity,
    View
} from "react-native";
import styles, { reportColors } from "../stylesheets/report-card-stylesheet";







const statusColor = (s: Status) =>
  s === "low" ? reportColors.scoreLow :
  s === "high" ? reportColors.scoreHigh :
  reportColors.scoreMedium;

  

const ReportCard: React.FC<ReportItemProps> = ({
  domain,
  score,
  status,
  scanDate,
  onPress
}) => {
  return (
    <TouchableOpacity 
        style={styles.card}
        onPress={onPress}
    >
      <View style={styles.left}>
        <Text style={styles.domainText}>{domain}</Text>
        <Text style={styles.scoreText}>
          <Text style={[styles.scoreNumber, { color: statusColor(status) }]}>
            Score: {score}
          </Text>
         
          <Text style={[styles.scoreLabel, { color: statusColor(status) }]}>
            {` (${status === "low" ? "Low" : status === "high" ? "High" : "Medium"})`}
          </Text>
       
        </Text>
        <Text style={styles.scanDate}>Scan date: {scanDate}</Text>
      </View>

      <View
        style={styles.viewDetailsWrap}
      >
        <View style={styles.viewDetailsInnerWrap}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <FontAwesome6 name="arrow-right-long" size={18} color="#3F5BD9" style={styles.viewDetailsArrow}/>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReportCard;


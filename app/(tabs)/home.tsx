import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { VictoryBar, VictoryChart, VictoryPie } from "victory-native";
import { useColorScheme } from "react-native";
import { Button, Text } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

const HomePage = () => {
  const [calories, setCalories] = useState(0);
  const [view, setView] = useState<"day" | "month">("day");
  const colorScheme = useColorScheme();
  const isLightTheme = colorScheme === "light";

  const themeContainerStyle = isLightTheme
    ? styles.lightContainer
    : styles.darkContainer;

  const addFood = () => {
    // Simulate adding 100 calories per food item
    setCalories(calories + 100);
  };

  const data = [
    { day: 1, calories: 150 },
    { day: 2, calories: 200 },
    { day: 3, calories: 250 },
    { day: 4, calories: 100 },
    { day: 5, calories: 300 },
    { day: 6, calories: 150 },
    { day: 7, calories: 400 },
    { day: 8, calories: 350 },
    { day: 9, calories: 200 },
    { day: 10, calories: 250 },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, themeContainerStyle]}>
      <StatusBar barStyle={isLightTheme ? "dark-content" : "light-content"} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={[
            styles.title,
            isLightTheme ? styles.lightThemeText : styles.darkThemeText,
          ]}>
          Calory Tracker
        </Text>
        <View style={styles.switchView}>
          <Button
            mode='contained'
            onPress={() => setView("day")}
            style={[styles.switchButton, view === "day" && styles.activeButton]}
            labelStyle={styles.buttonLabel}>
            Day View
          </Button>
          <Button
            mode='contained'
            onPress={() => setView("month")}
            style={[
              styles.switchButton,
              view === "month" && styles.activeButton,
            ]}
            labelStyle={styles.buttonLabel}>
            Month View
          </Button>
        </View>
        <View style={styles.chartContainer}>
          {view === "month" ? (
            <VictoryChart domainPadding={20}>
              <VictoryBar
                data={data}
                x='day'
                y='calories'
                style={{
                  data: { fill: isLightTheme ? "#6200ee" : "#bb86fc" },
                }}
              />
            </VictoryChart>
          ) : (
            <VictoryPie
              data={[
                { x: "Consumed", y: calories },
                { x: "Remaining", y: 2000 - calories },
              ]}
              colorScale={
                isLightTheme ? ["#6200ee", "#bb86fc"] : ["#bb86fc", "#6200ee"]
              }
              startAngle={-90}
              endAngle={90}
              innerRadius={50}
              padAngle={1}
              labelRadius={80}
              labels={({ datum }) =>
                datum.x === "Consumed" ? `${datum.y} cal` : ""
              }
              style={{
                labels: {
                  fill: isLightTheme ? "#000" : "#fff",
                  fontSize: 14,
                  fontWeight: "bold",
                },
              }}
              width={screenWidth}
              height={400}
              padding={{ top: 0, bottom: 0, left: 20, right: 20 }} // Adjust padding to use full height
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            mode='contained'
            onPress={addFood}
            style={styles.addButton}
            labelStyle={styles.buttonLabel}>
            Add Food
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    alignItems: "center",
    padding: 20,
  },
  lightContainer: {
    backgroundColor: "#f8f8f8",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  lightThemeText: {
    color: "#333",
  },
  darkThemeText: {
    color: "#fff",
  },
  switchView: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  switchButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: "#03dac6",
  },
  buttonLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  chartContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10, // Reduced margin to decrease space
  },
  addButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonContainer: {
    marginTop: 10, // Adjusted margin to ensure proper spacing
  },
});

export default HomePage;

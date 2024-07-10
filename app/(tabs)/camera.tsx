import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  useColorScheme,
} from "react-native";
import {
  Button,
  Text,
  Title,
  Appbar,
  Paragraph,
  IconButton,
  Card,
} from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Recipe, RecipesData } from "@/interfaces/RecipeInterfaces";

export default function CameraScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingredientsOnImage, setIngredientsOnImage] = useState<string | null>(
    null
  );
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const colorScheme = useColorScheme();
  const isLightTheme = colorScheme === "light";

  const themeContainerStyle = isLightTheme
    ? styles.lightContainer
    : styles.darkContainer;
  const themeTextStyle = isLightTheme
    ? styles.lightThemeText
    : styles.darkThemeText;
  const themeButtonStyle = isLightTheme
    ? styles.lightButton
    : styles.darkButton;
  const themeButtonLabelStyle = isLightTheme
    ? styles.lightButtonLabel
    : styles.darkButtonLabel;
  const themeIngredientsCardStyle = isLightTheme
    ? styles.lightIngredientsCard
    : styles.darkIngredientsCard;
  const themeRecipeCardStyle = isLightTheme
    ? styles.lightRecipeCard
    : styles.darkRecipeCard;
  const themeCardTitleStyle = isLightTheme
    ? styles.lightCardTitle
    : styles.darkCardTitle;
  const themeCardTextStyle = isLightTheme
    ? styles.lightCardText
    : styles.darkCardText;

  const imageOpacity = useSharedValue(0);
  const takePhotoButtonScale = useSharedValue(1);
  const suggestRecipeButtonScale = useSharedValue(1);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera permissions to make this work!"
        );
      }

      const { status: rollStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (rollStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setIngredientsOnImage(null);
        setRecipes([]);
        imageOpacity.value = withTiming(1, { duration: 1000 });
      }
    } catch (error) {
      console.error("Error taking photo: ", error);
    }
  };

  const suggestRecipe = async () => {
    if (!image) {
      Alert.alert("No Image", "Please take a photo of the ingredients first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    formData.append("prompt", "Suggest a recipe using these ingredients.");

    try {
      // TODO: Replace with your API endpoint
      // const response = await axios.post(
      //   "http://YOUR_LOCAL_IP:5000/upload",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      const mockResponse: RecipesData = {
        ingredients_on_image: "flour, eggs, milk",
        recipes: [
          {
            name: "Pan Cake",
            ingredients_needed: "flour, eggs, milk",
            preparation: ["Mix the ingredients", "Add Water"],
          },
          {
            name: "Croissant",
            ingredients_needed: "flour, eggs, milk",
            preparation: ["Mix the ingredients", "Add Water"],
          },
        ],
      };
      setIngredientsOnImage(mockResponse.ingredients_on_image);
      setRecipes(mockResponse.recipes);
    } catch (error) {
      console.error("Error uploading image: ", error);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setIngredientsOnImage(null);
    setRecipes([]);
    imageOpacity.value = withTiming(0, { duration: 500 });
  };

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }));

  const takePhotoButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: takePhotoButtonScale.value }],
  }));

  const suggestRecipeButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: suggestRecipeButtonScale.value }],
  }));

  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title='Ingredient Scanner'
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <Title style={[styles.title, themeTextStyle]}>
          Scan Your Ingredients
        </Title>
        <Animated.View style={takePhotoButtonAnimatedStyle}>
          <Button
            mode='contained'
            onPress={() => {
              takePhotoButtonScale.value = withTiming(
                0.95,
                { duration: 100 },
                () => {
                  takePhotoButtonScale.value = withTiming(1, { duration: 100 });
                }
              );
              pickImage();
            }}
            style={[styles.button, themeButtonStyle]}
            icon='camera'
            labelStyle={[styles.buttonLabel, themeButtonLabelStyle]}>
            Take Photo
          </Button>
        </Animated.View>
        {image && (
          <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
            <Image source={{ uri: image }} style={styles.image} />
            <IconButton
              icon='close'
              size={20}
              iconColor='#fff'
              style={styles.clearButton}
              onPress={clearImage}
            />
          </Animated.View>
        )}
        {image && (
          <Animated.View style={suggestRecipeButtonAnimatedStyle}>
            <Button
              mode='contained'
              onPress={() => {
                suggestRecipeButtonScale.value = withTiming(
                  0.95,
                  { duration: 100 },
                  () => {
                    suggestRecipeButtonScale.value = withTiming(1, {
                      duration: 100,
                    });
                  }
                );
                suggestRecipe();
              }}
              style={[styles.button, styles.suggestButton]}
              icon='food'
              labelStyle={[styles.buttonLabel, themeButtonLabelStyle]}>
              Suggest Recipes
            </Button>
          </Animated.View>
        )}
        {loading && (
          <ActivityIndicator
            size='large'
            color='#6200ee'
            style={styles.loader}
          />
        )}
        {ingredientsOnImage && (
          <>
            <Title style={[styles.resultTitle, themeCardTitleStyle]}>
              Ingredients:
            </Title>
            <Card style={[styles.resultCard, themeIngredientsCardStyle]}>
              <Card.Content>
                <Paragraph style={themeCardTextStyle}>
                  {ingredientsOnImage}
                </Paragraph>
              </Card.Content>
            </Card>
          </>
        )}
        {recipes.length > 0 && (
          <>
            <Title style={[styles.resultTitle, themeCardTitleStyle]}>
              Recipes:
            </Title>
            {recipes.map((recipe, index) => (
              <Card
                key={index}
                style={[styles.resultCard, themeRecipeCardStyle]}>
                <Card.Content>
                  <Title style={[styles.resultTitle, themeCardTitleStyle]}>
                    {recipe.name}
                  </Title>
                  <Paragraph style={themeCardTextStyle}>
                    Ingredients Needed: {recipe.ingredients_needed}
                  </Paragraph>
                  <Paragraph style={themeCardTextStyle}>
                    Preparation:
                    {recipe.preparation.map((step, i) => (
                      <Text style={themeCardTextStyle} key={i}>{`\n${
                        i + 1
                      }. ${step}`}</Text>
                    ))}
                  </Paragraph>
                </Card.Content>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: "#f8f8f8",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    backgroundColor: "#6200ee",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
    textAlign: "center",
  },
  lightThemeText: {
    color: "#333",
  },
  darkThemeText: {
    color: "#fff",
  },
  button: {
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  lightButton: {
    backgroundColor: "#6200ee",
  },
  darkButton: {
    backgroundColor: "#3700b3",
  },
  suggestButton: {
    backgroundColor: "#09cc3a",
  },
  buttonLabel: {
    fontWeight: "bold",
  },
  lightButtonLabel: {
    color: "#fff",
  },
  darkButtonLabel: {
    color: "#fff",
  },
  imageContainer: {
    width: "100%",
    marginVertical: 20,
    borderRadius: 15,
    elevation: 3,
    position: "relative",
  },
  image: {
    height: 300,
    borderRadius: 15,
  },
  clearButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#f76e3c",
    borderRadius: 15,
    zIndex: 1,
  },
  loader: {
    marginVertical: 20,
  },
  resultCard: {
    width: "100%",
    marginVertical: 10,
    padding: 10,
    borderRadius: 15,
    elevation: 3,
  },
  lightIngredientsCard: {
    backgroundColor: "#ffffff",
  },
  darkIngredientsCard: {
    backgroundColor: "#1e1e1e",
  },
  lightRecipeCard: {
    backgroundColor: "#ffffff",
  },
  darkRecipeCard: {
    backgroundColor: "#2c2c2c",
  },
  resultTitle: {
    fontSize: 20,
    marginVertical: 10,
  },
  lightCardTitle: {
    color: "#6200ee",
  },
  darkCardTitle: {
    color: "#bb86fc",
  },
  lightCardText: {
    color: "#000",
  },
  darkCardText: {
    color: "#fff",
  },
});

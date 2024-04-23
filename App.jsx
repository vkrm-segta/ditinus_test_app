/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [jsonData, setJsonData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);

  const [answers, setAnswers] = useState(Array.from({length: 10}, () => null));
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSubmitVisible, setSubmitVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleSubmit = () => {
    setSubmitVisible(!isSubmitVisible);
  };

  useEffect(() => {
    import('./data/questions.json')
      .then(response => setJsonData(response.default))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSelectOption = (item, option, index) => {
    setAnswered(true);
    setSelectedIndex(index);

    if (option === item.answer) {
      setCorrectAnswer(true);
      answers[currentIndex] = true;
    } else {
      setCorrectAnswer(false);
      answers[currentIndex] = false;
    }
  };

  const handleNext = () => {
    setScore(0);
    if (currentIndex === 9) {
      return;
    }
    setAnswered(false);
    setSelectedIndex(null);
    setCorrectAnswer(null);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSubmit = () => {
    toggleSubmit();
    const scoreData = answers.filter(item => item === true);
    setScore(scoreData.length);

    setAnswered(false);
    setSelectedIndex(null);
    setCorrectAnswer(null);
    setCurrentIndex(0);
    setAnswers(Array.from({length: 10}, () => null));
  };

  const renderQuestions = item => {
    return (
      <View>
        <View className="mt-10">
          <Text className="text-white text-lg font-semibold">
            {item.question}
          </Text>
        </View>
        <View className="mt-10">
          {item &&
            item.options &&
            item.options.map((option, i) => (
              <TouchableOpacity
                key={i}
                className="flex-row items-center justify-between border rounded-lg px-4 py-3 my-2"
                style={{
                  borderColor:
                    correctAnswer === null
                      ? '#a0a2aa'
                      : correctAnswer === true && i === selectedIndex
                      ? 'green'
                      : correctAnswer === false && i === selectedIndex
                      ? 'red'
                      : option === item.answer
                      ? 'green'
                      : '#a0a2aa',
                }}
                onPress={() => handleSelectOption(item, option, i)}
                disabled={answered}>
                <Text className="w-[90%] text-white font-bold pr-3">
                  {option}
                </Text>
                <View>
                  {correctAnswer === null ? (
                    <FontAwesome name="circle-thin" size={24} color="white" />
                  ) : correctAnswer === true && i === selectedIndex ? (
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                  ) : correctAnswer === false && i === selectedIndex ? (
                    <Entypo name="circle-with-cross" size={24} color="red" />
                  ) : option === item.answer ? (
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                  ) : (
                    <FontAwesome name="circle-thin" size={24} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#10162d]">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView className="relative">
        <View className="pt-10 px-8">
          <AntDesign name="leftcircle" size={24} color="white" />
          <View className="mt-8">
            <Text className="text-[#6d6e76]">Review Test</Text>
            <Text className="text-white text-[28px] font-semibold">
              Question {currentIndex <= 10 ? '' : '0'}
              {currentIndex + 1}/10
            </Text>
          </View>
          <View className="w-full flex-row mt-2">
            {answers.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor:
                    item === true ? 'green' : item === null ? 'white' : 'red',
                }}
                className="w-[8%] h-1 mx-[1%]"
              />
            ))}
          </View>

          {/* render Question Section */}
          {jsonData &&
            jsonData[currentIndex] &&
            renderQuestions(jsonData[currentIndex])}

          <TouchableOpacity onPress={toggleModal} className="mt-5 ml-auto">
            <Feather name="info" size={24} color="yellow" />
          </TouchableOpacity>

          {/* Next Button */}
          {currentIndex === 9 ? (
            <TouchableOpacity
              onPress={handleSubmit}
              className="rounded-lg bg-[#1bb4ce] py-2.5 mt-8"
              disabled={answered === false}>
              <Text className="text-center text-xl text-white font-bold">
                Submit
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleNext}
              className="rounded-lg bg-[#1bb4ce] py-2.5 mt-8"
              disabled={answered === false}>
              <Text className="text-center text-xl text-white font-bold">
                Next
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Explanation Modal */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center">
            <View
              className="w-[92%] bg-white p-5 justify-center items-center rounded-lg"
              style={{
                borderColor: 'rgba(0, 0, 0, 0.1)',
              }}>
              <Feather name="info" size={20} color="#1bb4ce" />

              <Text className="text-black text-xl font-semibold">
                Explanation:
              </Text>
              <Text className="mt-3">
                White blood cells, also known as leukocytes, play a crucial role
                in the immune system by identifying and fighting off pathogens
                such as viruses, bacteria, and other harmful
              </Text>
              <TouchableOpacity
                onPress={toggleModal}
                className="rounded-lg bg-[#1bb4ce] py-1.5 px-8 mt-8">
                <Text className="text-center text-xl text-white font-bold">
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Submit Modal */}
        <Modal isVisible={isSubmitVisible}>
          <View className="flex-1 justify-center items-center">
            <View
              className="w-[92%] bg-white p-5 justify-center items-center rounded-lg"
              style={{
                borderColor: 'rgba(0, 0, 0, 0.1)',
              }}>
              <Ionicons
                name="checkmark-done-circle"
                size={20}
                color="#1bb4ce"
              />
              <Text className="text-black text-xl font-semibold">
                Quize Completed!
              </Text>
              <Text className="mt-3">Your score {score}</Text>
              <TouchableOpacity
                onPress={toggleSubmit}
                className="rounded-lg bg-[#1bb4ce] py-1.5 px-8 mt-8">
                <Text className="text-center text-xl text-white font-bold">
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;

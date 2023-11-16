// Task.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Header from './Header';
import Body from './Body';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'todos';

export default function Task() {
  const [todos, setTodos] = useState([]);
  const [currentBssid, setCurrentBssid] = useState('');

  // 첫 렌더링 시 저장소에서 todos 가져오기
  useEffect(() => {
    const getTodos = async () => {
      try {
        const respTodos = await AsyncStorage.getItem(STORAGE_KEY);
        setTodos(JSON.parse(respTodos) ?? []);
      } catch (e) {
        console.log(e);
      }
    };
    getTodos();
  }, []);

  // todos 변경 시 저장소에 todos 저장하기
  useEffect(() => {
    const storeTodos = async () => {
      try {
        const jsonTodos = JSON.stringify(todos);
        await AsyncStorage.setItem(STORAGE_KEY, jsonTodos);
      } catch (e) {
        console.log(e);
      }
    };
    if (todos.length > 0) storeTodos();
  }, [todos]);

  const addTodo = (todoText) => {
    const newTodo = {
      id: Date.now(),
      text: todoText,
      bssid: currentBssid, // 현재 선택된 BSSID 할일에 저장
      completed: false,
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  const checkTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const saveBssid = (todoId, newBssid) => {
    setCurrentBssid((prevBssid) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === todoId ? { ...todo, bssid: newBssid } : todo
      );
      setTodos(updatedTodos);
      return newBssid;
    });
  };

  const handlePrint = () => {
    // 현재 추가된 아이템들의 멤버 변수들을 콘솔에 출력
    console.log(todos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <Header addTodo={addTodo} />
      <Body
        todos={todos}
        checkTodo={checkTodo}
        deleteTodo={deleteTodo}
        saveBssid={saveBssid}
        addTodo={addTodo}
      />

      {/* 추가된 부분: Print 버튼 */}
      <TouchableOpacity onPress={handlePrint} style={styles.printButton}>
        <Text style={styles.printButtonText}>Print</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 50,
    backgroundColor: '#EEE',
  },
  title: {
    fontWeight: '800',
    fontSize: 30,
    marginLeft: 20,
    marginBottom: 20,
  },

  // 디버깅용 , 입력한 bssid가 잘 입력됐는지 확인용
  // 버튼 클릭시 콘솔에서 생성된 아이템들에 대한 멤버변수들의 값 확인가능
  printButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  printButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

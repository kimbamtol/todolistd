import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Header from './Header';
import Body from './Body';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'todos';

export default function Task() {
  const [todos, setTodos] = useState([]);
  const [currentBssid, setCurrentBssid] = useState(''); // 현재 선택된 BSSID

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

  const saveBssid = (newBssid) => {
    setCurrentBssid(newBssid);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <Header addTodo={addTodo} />
      <Body todos={todos} checkTodo={checkTodo} deleteTodo={deleteTodo} saveBssid={saveBssid} />
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
});

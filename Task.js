import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import Header from './Header';
import Body from './Body';

const STORAGE_KEY = '@todoApp:todos';

export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
    };
  }

  componentDidMount() {
    this.loadTodos();
  }

  saveTodos = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos) {
        this.setState({ todos: JSON.parse(storedTodos) });
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  addTodo = (todoText) => {
    const newTodo = {
      id: Date.now(),
      text: todoText,
      completed: false,
    };

    this.setState(
      (prevState) => ({ todos: [newTodo, ...prevState.todos] }),
      () => this.saveTodos()
    );
  };

  checkTodo = (id) => {
    this.setState(
      (prevState) => ({
        todos: prevState.todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        }),
      }),
      () => this.saveTodos()
    );
  };

  deleteTodo = (id) => {
    this.setState(
      (prevState) => ({
        todos: prevState.todos.filter((todo) => todo.id !== id),
      }),
      () => this.saveTodos()
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Todo App</Text>
        <Header addTodo={this.addTodo} />
        <Body todos={this.state.todos} checkTodo={this.checkTodo} deleteTodo={this.deleteTodo} />
      </View>
    );
  }
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

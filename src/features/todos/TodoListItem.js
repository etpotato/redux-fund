import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as TimesSolid } from './times-solid.svg'

import { selectTodoById } from '../../features/todos/todosSlise'
import { availableColors, capitalize } from '../filters/colors'

const TodoListItem = ({ id }) => {
  const { text, completed, color } = useSelector((state) => selectTodoById(state.todos.entities, id))
  const dispatch = useDispatch()

  const handleCompletedChanged = () => dispatch({type: 'todos/todoToggled', payload: id})

  const handleColorChanged = (evt) => dispatch({type: 'todos/todoChangedColor', payload: { id, color: evt.target.value }})

  const onDelete = () => dispatch({type: 'todos/todoDeleted', payload: id})

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ))

  return (
    <li>
      <div className="view">
        <div className="segment label">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className="todo-text">{text}</div>
        </div>
        <div className="segment buttons">
          <select
            className="colorPicker"
            value={color}
            style={{ color }}
            onChange={handleColorChanged}
          >
            <option value=""></option>
            {colorOptions}
          </select>
          <button className="destroy" onClick={onDelete}>
            <TimesSolid />
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoListItem

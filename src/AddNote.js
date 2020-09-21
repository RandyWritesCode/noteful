import React from 'react';
import NotefulContext from './NotefulContext';
import config from './config'
import ValidationError from './ValidationError';
import PropTypes from 'prop-types';

class AddNote extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: {
        value: '',
        touch: false
      },
      content: {
        value: ''
      },
      folder: {
        value: ''
      },
      time:  {
        value: ''
      }
    }
  }

  updateName(name) {
    this.setState({ name: { value: name, touch: true} })
  }

  updateContent(content) {
    this.setState({ content: { value: content } })
  }

  updateFolder(folder) {
    this.setState({ folder: { value: folder } })
  }

  handleSubmit(event, callback) {
    
    event.preventDefault();
    const time=  new Date();
    const  {name, content, folder } = this.state;
    fetch(`${config.API_ENDPOINT}notes/`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({'name': name.value, content: content.value, folderId: folder.value, modified: time}),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(error => {
          throw error
        })
      }
      return res.json()
    })
    .then(data => {
      console.log(data)
      callback(data)
    })
    .catch(error => {
      console.error(error)
    })
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return 'Name is required'
    } 
  }


  render() {
    return (
      <NotefulContext.Consumer>
        {(context) => (
          <form onSubmit={(e) => this.handleSubmit(
            e,
            context.addNote)}>

            <label htmlFor='name'>
              Name:
            </label>
            <input id='name' type='text' onChange={e => this.updateName(e.target.value)} />
              {this.state.name.touch && <ValidationError message={this.validateName()}/>}
            <label htmlFor='content'>
              Content:
            </label>
            <input id='content' type='text' onChange={e => this.updateContent(e.target.value)} />
            <label htmlFor='folder'>
              Folder:
            </label>
            <select id='folder' name='folder' onChange={e => this.updateFolder(e.target.value)}>
              <option value='select'>Select a Folder</option>
              {context.folders.map(folder => (
                <option
                  key={folder.id}
                  value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <button 
              type='submit'
              disabled={
                this.validateName()
              }
              >Submit</button>
            <button type='reset'>Cancel</button>
          </form>
        )}
      </NotefulContext.Consumer>
    )
  }
}

AddNote.propTypes ={
  name: PropTypes.string.isRequired
}

export default AddNote

/*



                      {(context) => console.log(context, '567') || (

*/
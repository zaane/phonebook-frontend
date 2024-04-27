import { useEffect, useState } from 'react'
import contactService from './services/contacts'

const Filter = (props) => {
  return <div>
    filter contacts by
    <input
      value={props.filter}
      onChange={props.onChange}
    />
  </div>
}

const ContactForm = (props) => {
  return <form>
    <div>
      name: <input
        value={props.newName}
        onChange={props.handleNameChange}
      />
    </div>
    <div>
      number: <input
        value={props.newNumber}
        onChange={props.handleNumberChange}
      />
    </div>
    <div>
      <button
        onClick={props.addContact}
        type="submit">
        add
      </button>
    </div>
  </form>
}

const Contacts = (props) => {
  return <div>
    {
      props.persons.map(person =>
        <Contact
          key={person.id}
          name={person.name}
          number={person.number}
          onDelete={() => {
            if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
              props.onDelete(person.id)
            }
          }}
        />)
    }

  </div>
}

const Contact = (props) => {
  return <div>
    {props.name} {props.number}
    <button onClick={props.onDelete}>
      Delete contact
    </button>
  </div>
}

const Notification = ({ message, type }) => {
  const successStyle = {
    color: type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    width: 'fit-content',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  //TODO: make error and update styles

  if (message === null) {
    return null
  }

  return (
    <div style={successStyle}>
      {message}
    </div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '555-555-5555',
      id: 1
    },
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    contactService
      .getAll()
      .then(loadedContacts => setPersons(loadedContacts))
  }, [])

  const addContact = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }

    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already in the phonebook. Do you want to update their number to ${newNumber}?`)) {
        const personToUpdate = persons.find(person => person.name === newName)
        updateContact(personToUpdate.id, newPerson)
      }

    } else {
      contactService
        .create(newPerson)
        .then(response => {
          setNotificationMessage({message: 'add successful', type: 'success'})
          setTimeout(() => setNotificationMessage(null), 5000)
          setPersons(persons.concat(response))
        })

    }
    setNewName('')
    setNewNumber('')
  }

  const updateContact = (id, newContact) => {
    contactService
      .update(id, newContact)
      .then(response => {
        setNotificationMessage({message: 'update successful', type: 'success'})
        setTimeout(() => setNotificationMessage(null), 5000)
        setPersons(persons.map(person => person.id === id ? response : person))
      })
      .catch(error => {
        setNotificationMessage({message: `${newContact.name} has already been deleted from the server.`, type: 'failure'})
      })
  }

  const deleteContact = id => {
    contactService
      .deleteContact(id)
      .then(() => setPersons(persons.filter(person => person.id !== id)))
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>

      {notificationMessage 
      ? <Notification message={notificationMessage.message} type={notificationMessage.type}/>
      : null}

      <Filter filter={filter} onChange={handleFilterChange} />

      <h2>Save New Contact</h2>

      <ContactForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addContact={addContact}
      />

      <h2>Numbers</h2>

      <Contacts persons={personsToShow} onDelete={deleteContact} />
    </div>
  )
}

export default App
function UserLogin ({input, handleInput, handleSubmit}) {
  return (
    <form action="submit">
      <label htmlFor="newUser">Input Your Snowfort ID: </label>
      <input onChange={handleInput} type="text" id="newUser" value={input} />
      <button onClick={handleSubmit}>Let's Fort!</button>
    </form>
  )
}

export default UserLogin;
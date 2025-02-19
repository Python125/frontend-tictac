import { useState, React, useEffect } from "react";
import axios from "axios";
import { Text, Button, Box, Link, Input } from '@chakra-ui/react';

const apiURL = import.meta.env.VITE_API_URL;

function Game({ userId }) {
  const [games, setGames] = useState([]);
  const [gameInput, setGameInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      const response = await axios.get(`${apiURL}/users/${userId}`);
      const gamesData = Array.isArray(response.data) ? response.data : [];
      setGames(gamesData);
      setUsername(response.data.username || '');
    }
    fetchGames();
  }, [userId]);

  function addGame(e) {
    setGameInput(e.target.value);
  }

  function submitGame(e) {
    e.preventDefault();
    if (!gameInput.trim()) return;

    const newGame = {
      id: games.length + 1,
      name: gameInput,
      maxParticipantCount: [],
      minBuyInAmount: 0,
      maxBuyInAmount: 0,
      status: 'Active',
      userId: userId,
      seats: [],
    }
    console.log(newGame);

    axios.post(`${apiURL}/users/${userId}/games`, newGame).then(response => {
      setGames([...games, response.data]);
      setGameInput('');
    })
  }

  return (
    <Box>
      <Text fontWeight='bold' fontSize='2xl'>Games</Text>
      <form onSubmit={submitGame}>
        <Input type="text" width='200px' placeholder="Enter game name" onChange={addGame} value={gameInput} />
        {/* <Button type='submit' marginLeft='5px' marginBottom='5px' width='85px' fontWeight='bold' onClick={submitGame}>Join Game</Button> */}
        <Text fontWeight='bold' fontSize='xl' marginTop='0.5rem' color='black'>Join a game below</Text>
      </form>
      <ul>
        {games.map(game => {
          return (
            <li key={game.id}>
              <Text variant='plain' _hover={{textDecoration: 'underline', color: 'blue.600'}} href={`/users/${userId}/games/${game.id}`} color='black'>{game.name}</Text>
            </li>
          )
        })}
      </ul>
    </Box>
  )
}

export default Game;
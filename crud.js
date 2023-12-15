export async function createPlaylist(name) {
  const response = await fetch(`/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name}),
  });
  const data = await response.json();
  return data;
}

export async function readPlaylist(name, tracks) {
  try {
    const response = await fetch(`/read?name=${name, tracks}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function updatePlaylist(name) {
  try {
    const response = await fetch(`/update?name=${name}`, {
      method: 'PUT',
    });
    const data = await response.json(); 
    return data;
  } catch (err) {
    console.log(err); 
  }
}

export async function deletePlaylist(name) {
  try {
    const response = await fetch(`/delete?name=${name}`, {
      method: 'DELETE',
    });
    const data = await response.json(); 
    return data;
  } catch (err) {
    console.log(err); 
  }
}

export async function readAllPlaylists() {
  const response = await fetch(`/dump`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

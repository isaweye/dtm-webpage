const axios = require('axios');

const apiConfigUrl = 'https://raw.githubusercontent.com/Defend-The-Machine/mod/main/data.json';

module.exports = async (req, res) => {
  try {
    const { gameId } = req.query;

    const responseApi = await axios.get(apiConfigUrl);
    const dataApi = responseApi.data;

    const apiBaseUrl = `${dataApi.link}/v1/server/archive`;

    let apiUrl = apiBaseUrl;
    if (gameId) {
      apiUrl = `${apiBaseUrl}/${gameId}`;
    }

    const response = await axios.get(apiUrl);
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    console.error('Ошибка при получении данных с API:', error);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
};

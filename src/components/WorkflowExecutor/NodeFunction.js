

export const filterData = (data, columnName) => {
    return data.map(item => ({
      ...item,
      [columnName]: item[columnName].toLowerCase()
    }));
  };
  
  export const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  export const convertFormat = (data) => {
    // Implement your conversion logic here
    return data;
  };
  
  export const sendPostRequest = async (data) => {
    const response = await fetch('https://requestcatcher.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      throw new Error('Failed to send POST request');
    }
  };
  
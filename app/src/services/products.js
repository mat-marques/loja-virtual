async function search({ searchValue, page, perPage }) {
  try {
    const response = await fetch(
      `http://localhost:80/api/search.php?search=${searchValue}&page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers" : "Content-Type",
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }

  return null;
}

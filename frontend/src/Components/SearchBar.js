import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Perform search logic here (e.g., send the searchTerm to a search API)
    console.log("Searching for:", searchTerm);
  };

  return (
    <>
      <Form onSubmit={handleSearch} className="d-flex">
        <FormControl
          type="text"
          placeholder="جستجو کنید"
          className="mr-2 search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" variant="outline-primary" className="btn-search">
          جستجو
        </Button>
      </Form>
    </>
  );
}

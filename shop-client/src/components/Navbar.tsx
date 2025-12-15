import { TextField } from '@mui/material';
import { useState } from 'react';

const SearchBar = ({ onSearch }: { onSearch: (searchText: string) => void }) => {
    const [searchInput, setSearchInput] = useState<string>('');

    const handleSearch = () => {
        onSearch(searchInput.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <TextField
            placeholder="Rechercher une boutique..."
            size="medium"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ minWidth: 300 }}
        />
    );
};

export default SearchBar;

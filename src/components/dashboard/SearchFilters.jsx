// src/components/SearchFilters.jsx
export const SearchFilters = ({ onFilterChange, data }) => {
    const [countryFilter, setCountryFilter] = useState('all');
    const [userTypeFilter, setUserTypeFilter] = useState('all');
    const [useCaseFilter, setUseCaseFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
  
    const uniqueCountries = [...new Set(data.map(item => item.countryCode))];
    const uniqueUserTypes = [...new Set(data.map(item => item.userType))];
    const uniqueUseCases = [...new Set(data.map(item => item.useCase))];
  
    const handleChange = () => {
      onFilterChange({
        country: countryFilter,
        userType: userTypeFilter,
        useCase: useCaseFilter,
        search: searchTerm
      });
    };
  
    useEffect(() => {
      handleChange();
    }, [countryFilter, userTypeFilter, useCaseFilter, searchTerm]);
  
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              <option value="all">All Countries</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
            >
              <option value="all">All User Types</option>
              {uniqueUserTypes.map(type => (
                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Use Case</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={useCaseFilter}
              onChange={(e) => setUseCaseFilter(e.target.value)}
            >
              <option value="all">All Use Cases</option>
              {uniqueUseCases.map(useCase => (
                <option key={useCase} value={useCase}>{useCase}</option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  };
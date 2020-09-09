import { useContext } from 'react'; 
import SettingsContext from 'utils/contexts/SettingsContext';

const useSettings = () => useContext(SettingsContext);

export default useSettings;

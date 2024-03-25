import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import Input from '../../views/ingredients tabs/Input';
import Summary from '../../views/ingredients tabs/Summary';
import { useStateContext } from '../../contexts/ContextProvider';
import { useEffect } from 'react';

export default function IngredientsTab() {
  const { permission } = useStateContext();
  const [value, setValue] = useState('1');
  const [inputAccess, SetInputAccess] = useState(false);
  const [summaryAccess, SetSummaryAccess] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (Array.isArray(permission)) {
        const firstElement = permission;
        const result = firstElement.map(permission => {
          const words = permission.split(' ');
          if (words.length > 2) {
            const combinedWords = [words[0], words[1]].join(' ');
            return combinedWords;
          } else {
            return permission;
          }
        });
        if (result.includes('Ingredients Input') && result.includes('Ingredients Summary')) {
          SetSummaryAccess(true)
          SetInputAccess(true)
        } else if (result.includes('Ingredients Input')) {
          SetInputAccess(true)
          SetSummaryAccess(false)
          setValue('1')
        } else if (result.includes('Ingredients Summary'))  {
          setValue('2')
          SetInputAccess(false)
          SetSummaryAccess(true)
        }
      } else {
        const firstElement = permission;
        const permissionsArray = firstElement.split(',');
        const result = permissionsArray.map(permission => {
          const words = permission.split(' ');
          if (words.length > 2) {
            const combinedWords = [words[0], words[1]].join(' ');
            return combinedWords;
          } else {
            return permission;
          }
        });
       
        if (result.includes('Ingredients Input') && result.includes('Ingredients Summary')) {
          SetSummaryAccess(true)
          SetInputAccess(true)
        } else if (result.includes('Ingredients Input')) {
          SetInputAccess(true)
          SetSummaryAccess(false)
          setValue('1')
        } else if (result.includes('Ingredients Summary'))  {
          setValue('2')
          SetInputAccess(false)
          SetSummaryAccess(true)
        }
      }
  }, [])

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            { inputAccess &&
              <Tab label="Input" value="1" />
            }
            { summaryAccess &&
              <Tab label="Summary" value="2" />
            }
            
          </TabList>
        </Box>
        { inputAccess &&
          <TabPanel value="1"><Input /></TabPanel>
        }
        { summaryAccess &&
          <TabPanel value="2"><Summary /></TabPanel>
        }
        
      </TabContext>
    </Box>
  )
}

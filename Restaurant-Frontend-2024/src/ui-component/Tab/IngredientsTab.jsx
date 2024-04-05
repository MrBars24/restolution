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
    let permissionsArray = Array.isArray(permission) ? permission : permission.split(',');

    const result = permissionsArray.map(permission => {
        const words = permission.split(' ');
        if (words.length > 2) {
            return [words[0], words[1]].join(' ');
        } else {
            return permission;
        }
    });

    const hasInputAccess = result.includes('Ingredients Input');
    const hasSummaryAccess = result.includes('Ingredients Summary');

    if (hasInputAccess) {
      SetInputAccess(true);
      if (hasSummaryAccess) {
        SetSummaryAccess(true);
      } else {
        SetSummaryAccess(false);
        setValue('1');
      }
    } else if (hasSummaryAccess) {
        SetInputAccess(false);
        SetSummaryAccess(true);
        setValue('2');
    }
  }, [permission]);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            { inputAccess && <Tab label="Input" value="1" /> }
            { summaryAccess && <Tab label="Summary" value="2" /> }
          </TabList>
        </Box>
        { inputAccess && <TabPanel value="1"><Input /></TabPanel> }
        { summaryAccess && <TabPanel value="2"><Summary /></TabPanel> }
      </TabContext>
    </Box>
  )
}

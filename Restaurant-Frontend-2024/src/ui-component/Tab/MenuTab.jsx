import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabContext } from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Menu from '../../views/menu tabs/Menu';
import Category from '../../views/menu tabs/Category';
import Tabs from '../../views/menu tabs/Tab';
import { useStateContext } from '../../contexts/ContextProvider';

export default function MenuTab() {
  const { permission } = useStateContext();
  const [value, setValue] = useState('1');
  const [tabsAccess, setTabsAccess] = useState(false);
  const [categoryAccess, setCategoryAccess] = useState(false);
  const [menuAccess, setMenuAccess] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    let permissionsArray = Array.isArray(permission) ? permission : permission.split(',');

    const result = permissionsArray.map(permission => {
        const words = permission.split(' ');
        if (words.length > 2) {
            return [words[0], words[1]].join(' ');
        } else if (words.length = 2 ) {
          return [words[0]].join(' ');
        } else {
          return permission;
        }
    });

    const hasTabsAccess = result.includes('Menu Tabs');
    const hasCategoryAccess = result.includes('Menu Category');
    const hasMenuAccess = result.includes('Menu');


    if (hasTabsAccess) {
      setTabsAccess(true);
    }

    if (hasCategoryAccess) {
      setValue('2');
      setCategoryAccess(true);
    }

    if (hasMenuAccess) {
      setValue('3');
      setMenuAccess(true);
    }

    // switch (true) {
    //   case (hasTabsAccess && hasCategoryAccess && hasMenuAccess):
    //     setTabsAccess(true);
    //     setCategoryAccess(true);
    //     setMenuAccess(true);
    //     break;
    //   case hasTabsAccess:
    //     setTabsAccess(true);
    //     setCategoryAccess(false);
    //     setMenuAccess(false);
    //     break;
    //   case hasCategoryAccess:
    //     setValue('2');
    //     setCategoryAccess(true);
    //     setTabsAccess(false);
    //     setMenuAccess(false);
    //     break;
    //   case hasMenuAccess:
    //     setValue('3');
    //     setMenuAccess(true);
    //     setTabsAccess(false);
    //     setCategoryAccess(false);
    //     break;
    // }
  }, [permission]);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabsAccess && <Tab label="Tabs" value="1" />}
            {categoryAccess && <Tab label="Category" value="2" />}
            {menuAccess && <Tab label="Menu" value="3" />}
          </TabList>
        </Box>
          {tabsAccess && <TabPanel value="1"><Tabs /></TabPanel>}
          {categoryAccess && <TabPanel value="2"><Category /></TabPanel>}
          {menuAccess && <TabPanel value="3"><Menu /></TabPanel>}
      </TabContext>
    </Box>
  )
}

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CatalogService, { CatalogBase, CatalogBaseForList } from "../services/catalog.service"



export default function CatalogBaseMenu(props:any) {
  const {handleCatalogSelection} = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<null | number>(null);
  const [options, setOptions] = React.useState<string[]>([]);
  const [catalogBase, setcatalogBase] = React.useState<CatalogBaseForList[]>([]);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    CatalogService.getAllCatalogBases().then(
      (response) => {
        let catalogBases = response.data
        setcatalogBase(catalogBases)
        setOptions(catalogBases.map(v => v.catalog_base_name))
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
      }
    );
  }, [])

 
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    console.log(options)
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    handleCatalogSelection(options[index], catalogBase[index])

    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showSelected = () => {
    if(selectedIndex===null){
        return ""
    }else{
        return options[selectedIndex]
    }
  }
  return (
    <div>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: 'background.paper' }}
      >
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
            primary="Please choose a Catalog"
            secondary= {showSelected()}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
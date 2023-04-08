import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CatalogService, { CatalogBase, CatalogExtension } from "../services/catalog.service"



export default function CatalogExtensionMenu(props:any) {
  const {handleCatalogExtensionSelection, catalog_name} = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<null | number>(null);
  const [options, setOptions] = React.useState<string[]>([]);
  const [catalogExtensions, setcatalogExtension] = React.useState<string[]>([]);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    
    CatalogService.getCatalogExtensionNames(catalog_name).then(
      (response) => {
        let catalogExtensions = response.data
        setcatalogExtension(catalogExtensions)
        setOptions(catalogExtensions.map(v => v))
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
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    handleCatalogExtensionSelection(options[index], catalogExtensions[index])

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
            primary="Select Catalog Extension"
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
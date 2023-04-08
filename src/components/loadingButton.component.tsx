import React from 'react';
import PropTypes from 'prop-types';
import { Check } from '@mui/icons-material';
import { Button, CircularProgress} from '@mui/material';






const LoadingButton = (props:any) => {
  const { loading, done, checked, onChange, ...other } = props;
  console.log(loading)
  if (checked) {
    return (
      <Button variant="contained" color="error" onClick={onChange}>
      Remove From Catalog
    </Button>
    )
    return (
      <Button {...other} disabled>
        <Check />
      </Button>
    );
  }
  else if (loading) {
    return (
      <Button>
        <CircularProgress />
      </Button>
    );
  } else {
    return(
      <Button variant="outlined" color="success" onClick={onChange}>
      Add To Catalog
  </Button>
    )
    return (
      <Button {...other} />
    );
  }
}

LoadingButton.defaultProps = {
  loading: false,
  done: false,
  checked:false,
  onChange: () => {},
  };

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  done: PropTypes.bool,
  checked:PropTypes.bool,
  onChange: PropTypes.func,
};

export default (LoadingButton);
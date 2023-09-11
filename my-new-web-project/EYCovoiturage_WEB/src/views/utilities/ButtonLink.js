import * as React from 'react';
import Link from '@mui/material/Link';

export default function ButtonLink({ label, onMouseEnter, onMouseLeave }) {
  return (
    <Link
      component="button"
      variant="body2"
      onClick={() => {
        console.info("I'm a button.");
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {label}
    </Link>
  );
}






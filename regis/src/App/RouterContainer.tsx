import { cloneElement } from 'react';

export const RouterContainer = (props: any) => {
  return <div className='router-container'>{cloneElement(props.children)}</div>;
};

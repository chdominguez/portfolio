import { Button } from '@mantine/core';
import classes from './Button.module.css';

export function ChristianButton({ children }: { children: React.ReactNode }) {
  return <Button className={classes.button}>{children}</Button>;
}

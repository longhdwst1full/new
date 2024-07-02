export interface MenuProps {
    key: string;
    label: string;
}
export interface MenuCustom extends MenuProps {
    children: MenuProps[];
}
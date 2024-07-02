import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];
function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}
export const itemMenus: MenuItem[] = [
     
    getItem('Home', '/homepage'),
    getItem('Products', '/product'),
    
    
];

 
 
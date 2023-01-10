import { UserProps, UserStatus } from '@/interfaces/UserProps';
import { userStore } from '@/stores/userStore';
import { MenuItem, MenuList, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { OptionMenuProps } from './OptionMenu';

export interface ChatOptionMenuProps extends OptionMenuProps {
  isBlocked: boolean;
}

export function ChatOptionMenu({ user, isFriend, isBlocked }: ChatOptionMenuProps) {
  const { addFriend, deleteFriend, addBlock, deleteBlock } = userStore();

  return (
    <MenuList>
      <MenuItem as={Link} href={`/user/${user.name}`}>
        VIEW PROFILE
      </MenuItem>
      <MenuItem>
        {user.status === UserStatus.ONLINE ? (
          <Text>INVITE TO GAME</Text>
        ) : (
          <Text color="gray.200">INVITE TO GAME</Text>
        )}
      </MenuItem>
      <MenuItem>
        {!isFriend ? (
          <Text color="win" onClick={() => addFriend(user.name)}>
            ADD FRIEND
          </Text>
        ) : (
          <Text color="red" onClick={() => deleteFriend(user.name)}>
            DELETE FRIEND
          </Text>
        )}
        {!isBlocked ? (
          <Text color="win" onClick={() => addBlock(user.name)}>
            ADD FRIEND
          </Text>
        ) : (
          <Text color="red" onClick={() => deleteBlock(user.name)}>
            DELETE FRIEND
          </Text>
        )}
      </MenuItem>
    </MenuList>
  );
}

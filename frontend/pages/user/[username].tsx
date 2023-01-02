import CustomAvatar from '@/components/CustomAvatar';
import { CustomButton } from '@/components/CustomButton';
import MatchHistory from '@/components/MatchHistory';
import WinLoseSum from '@/components/WinLoseSum';
import { MatchHistoryProps } from '@/interfaces/MatchProps';
import { UserProps, UserStatus } from '@/interfaces/UserProps';
import MainLayout from '@/layouts/MainLayout';
import { userStore } from '@/stores/userStore';
import { avatarFetch } from '@/utils/avatarFetch';
import { customFetch } from '@/utils/customFetch';
import { Box, Center, Divider, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';

export default function UserProfilePage() {
  const router = useRouter();
  const username: string = router.query.username as string;
  const [user, setUser] = useState<UserProps>();
  const { addFriend } = userStore();

  useEffect(() => {
    async function setUserInfo() {
      try {
        const json = await customFetch('GET', `/user/name/${username}`);
        const imgUrl = await avatarFetch('GET', `/user/avatar/name/${username}`);
        const fetchedUser = {
          id: json.id,
          name: json.username,
          imgUrl: imgUrl,
          status: json.status,
          rating: json.rating,
        };
        setUser(fetchedUser);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
          return;
        }
      }
    }
    setUserInfo();
  }, []);

  const winCnt = 42;
  const loseCnt = 42;

  const dummyMatchHistory: MatchHistoryProps = {
    myName: 'asdfasdf',
    myScore: 4,
    oppName: 'pongmaster',
    oppScore: 10,
  };

  return (
    <>
      {user === undefined ? null : (
        <VStack>
          <Head>
            <title>{`${user.name} | LastPong`}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Flex
            bg="white"
            flexDirection="column"
            borderRadius={42}
            w="40%"
            minW="500px"
            margin="auto"
            alignItems="center"
            justifyContent="center"
            my={30}
            p={20}
          >
            <HStack>
              <Box mr={10}>
                <CustomAvatar url={user.imgUrl} size="xl" />
              </Box>
              <VStack>
                <Text fontSize="3xl" color="main">
                  {user.name.toUpperCase()}
                </Text>
                <Text fontSize="lg">{`RATING ${user.rating}`}</Text>
              </VStack>
            </HStack>
            <Divider border="1px" borderColor="main" my={10} />
            <WinLoseSum winCnt={winCnt} loseCnt={loseCnt} fontSize="3xl" />
            <VStack w="100%" my={10} maxH="15vh" overflowY="scroll">
              {[...Array(10)].map((_, idx) => (
                <MatchHistory
                  key={idx}
                  myName={dummyMatchHistory.myName}
                  myScore={dummyMatchHistory.myScore}
                  oppName={dummyMatchHistory.oppName}
                  oppScore={dummyMatchHistory.oppScore}
                />
              ))}
            </VStack>
          </Flex>
          <CustomButton
            size="xl"
            onClick={() => {
              addFriend(user.name);
            }}
          >
            ADD FRIEND
          </CustomButton>
        </VStack>
      )}
    </>
  );
}

UserProfilePage.getLayout = function (page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

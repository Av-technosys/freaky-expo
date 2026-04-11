// import { View } from 'react-native';
// import SkeletonContent from 'react-native-skeleton-content';

// export default function HeaderSkeleton() {
//   return (
//     <View className="px-4 mt-4">
//       <SkeletonContent
//         isLoading={true}
//         layout={[
//           // 🔹 Top Row Container
//           {
//             key: 'top-row',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: 20,
//             children: [
//               // LEFT TEXT BLOCK
//               {
//                 key: 'left-text',
//                 children: [
//                   {
//                     key: 'line-1',
//                     width: 140,
//                     height: 22,
//                     marginBottom: 8,
//                     borderRadius: 6,
//                   },
//                   {
//                     key: 'line-2',
//                     width: 180,
//                     height: 32,
//                     borderRadius: 6,
//                   },
//                 ],
//               },

//               // RIGHT ICONS
//               {
//                 key: 'right-icons',
//                 flexDirection: 'row',
//                 children: [
//                   {
//                     key: 'icon-1',
//                     width: 48,
//                     height: 48,
//                     borderRadius: 24,
//                     marginRight: 12,
//                   },
//                   {
//                     key: 'icon-2',
//                     width: 48,
//                     height: 48,
//                     borderRadius: 24,
//                   },
//                 ],
//               },
//             ],
//           },

//           // 🔹 Address Bar
//           {
//             key: 'address-bar',
//             width: '100%',
//             height: 54,
//             borderRadius: 30,
//           },
//         ]}
//       />
//     </View>
//   );
// }

import  {Text} from  'react-native'
 export default function HeaderSkeleton() {
    return ( <Text> Loading </Text>)
 }

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { fetchPetById } from '../features/petSlice'; // 假设你在这里引入了 fetchPetById 函数
import { useDispatch } from 'react-redux';
import { Icon } from '@rneui/themed';

export default function PetDetailScreen({ route, navigation }) {
  const { pet } = route.params || {};  // 从路由参数中获取 petId
  const petId = pet.id;
  const [petData, setPetData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // 如果 petId 存在，则调用 fetchPetById 获取宠物数据
    if (petId) {
      dispatch(fetchPetById(petId))
        .then((action) => {
          if (action.payload) {
            setPetData(action.payload);  // 更新宠物数据
          }
        })
        .catch((error) => {
          console.error("Error fetching pet data:", error);
        });
    }
  }, [petId, dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // 当屏幕获得焦点时，重新加载数据
      if (petId) {
        dispatch(fetchPetById(petId)).then(action => {
          setPetData(action.payload);  // 更新 petData
        });
      }
    });

    // 清理监听器
    return unsubscribe;
  }, [navigation, petId, dispatch]);

  // 如果 petData 为空，显示加载中的 UI
  if (!petData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading pet data...</Text>
      </View>
    );
  }

  // 获取最新的体重
  const getLatestWeight = () => {
    if (petData.weights && petData.weights.length > 0) {
      const sortedWeights = [...petData.weights].sort((a, b) => new Date(b.date) - new Date(a.date));
      return sortedWeights[0].value;  // 返回最新的体重值
    }
    return 'No weight data available';
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');  // 保证两位数
    const day = today.getDate().toString().padStart(2, '0');  // 保证两位数
  
    return `${year}/${month}/${day}`; // 返回格式为 YYYY/MM/DD
  };
  
  // 获取今天的水摄入量
  const getLatestWater = () => {
    const todayDate = getTodayDate();  // 获取今天的日期，格式为 YYYY/MM/DD
  
    if (petData.waterLogs && petData.waterLogs.length > 0) {
      // 查找今天的水摄入记录
      const todayWaterLog = petData.waterLogs.find(log => {
        const logDate = log.date;  // 这里假设 waterLogs 中的日期格式为 YYYY/MM/DD
        return logDate === todayDate; // 直接比较日期部分
      });
  
      if (todayWaterLog) {
        return todayWaterLog.value; // 返回今天的水摄入量
      }
    }
  
    return 0; // 如果今天没有水记录，返回0
  };



  const handleBackToOverview = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('PetOverview')}>
          <Icon name="arrow-back" type="material" color="#51A39D" />
        </TouchableOpacity>
        <Text style={styles.header}>Pet Detail</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate('EditScreen', {
              pet: petData,
              isEdit: true,
            })
          }
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* 宠物信息 */}
      <Image source={{ uri: petData.imageUrl }} style={styles.petImage} />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{petData.name}</Text>
        <Text style={styles.petDetails}>{petData.breed}</Text>
        <Text style={styles.petDetails}>{petData.age} months</Text>
        <Text style={styles.petDetails}>{petData.gender}</Text>
      </View>

      {/* 四个部分 */}
      <View style={styles.sections}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => {
            console.log(petId);
            navigation.navigate('WeightDetailScreen', { petId });
          }}
        >
          <View style={styles.weightBox}>
            <Text style={styles.sectionText}>Weight</Text>
            <Text style={styles.weightText}>Current: {getLatestWeight()} kg</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate('WaterDetailScreen', { petId: pet.id })}
        >
          <View style={styles.weightBox}>
            <Text style={styles.sectionText}>Water Intake</Text>
            <Text style={styles.weightText}>Today: {getLatestWater()} L</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.section}
          
        >
          <Text style={styles.sectionText}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.section}
        onPress={() => navigation.navigate('ExcretionDetailScreen', { petId: pet.id })}
        >
          <Text style={styles.sectionText}>Excretion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6c2c2',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    color: '#007BFF',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  editButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  editText: {
    fontSize: 18,
    color: '#007BFF',
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  petInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  petDetails: {
    fontSize: 16,
    color: 'gray',
  },
  sections: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  section: {
    width: '45%',
    backgroundColor: '#f4f4f4',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weightBox: {
    alignItems: 'center',
  },
  weightText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'gray',
    marginTop: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
  },
  editButton: {
    color: '#51A39D',
    marginTop: 10,
  },
  loading: {
    marginTop: 30,
  }
});

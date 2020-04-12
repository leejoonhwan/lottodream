import React , {useState, useEffect,useRef} from 'react';
import {
    FlatList,
    StyleSheet,
    YellowBox,
    View,
    Text,
} from 'react-native';
import LottoCardGroup from '../component/card/LottoCardGroup'
import Back from '../../assets/svg/btn_bigx.svg' ;
import AsyncStorage from '@react-native-community/async-storage';
import DeleteModal from '../component/modal/BackWarning';
import Detail from './DetailLotto'

YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
  ]);

  
const constant = require('../util/Constant')
const clickSafe =require('../util/click_safe')

const MyLotto = (props:any) => {
    useEffect(() => {
        //@ts-ignore
        Text.defaultProps = Text.defaultProps || {};     Text.defaultProps.allowFontScaling = false;
    }, [])
    const [deleteId, setDeleteId] =useState('');
    const [myLotto, setMyLotto] = useState([]);
    const modalOpen = useRef()

    // 나의 로또 정보 가져오기
    const retrieveData = async (key : string) => {
        try {
            let value = await AsyncStorage.getItem(key);
            if (value === null) return ;
            console.log(value)
            //@ts-ignore
            const lottoData = JSON.parse(value);
            setMyLotto(lottoData);
        
        } catch (error) {
            console.log('::: AsyncStorage get ERROR !! ')
        }
    }

    // 초기화
    useEffect(() => {
        retrieveData(constant.LOTTO_KEY);
    }, [])
    
    // 삭제할 아이템 수집 & modal오픈
    function detailItem (id:any) {
        console.log('디테일 뷰 아이디 :',id)
        
        const data = myLotto.filter(function (data:any) {
            return data.id ===id
        })

        console.log('아이디에 해당되는 데이터 ', data[0])
        console.log('아이디에 해당되는 데이터 ', data.numbers, data.dreams,data.date)
        
        props.navigation.navigate('DetailLotto', {
            //@ts-ignore
            id: data[0].id,
            nums: data[0].numbers, 
            words: data[0].dreams,
            date: data[0].date,
            name: data[0].name,
            update: (id: any, name: string) => updateName(id, name),
        })
    }

    const updateName = async (id : any, name : string) => {
        console.log(id, name)
        for(var i in myLotto) {
            if(myLotto[i].id === id) {
                myLotto[i].name = name;   
            }
        }

        console.log('', myLotto)
        if(storeData(constant.LOTTO_KEY, JSON.stringify(myLotto))) {
            console.log('SAVE SUCCESS');
            retrieveData(constant.LOTTO_KEY);
        }
    }

    // 삭제할 아이템 수집 & modal오픈
    function deleteItem (id:any) {
        console.log('삭제요청 아이디 :',id)
        setDeleteId(id)

        //@ts-ignore
        modalOpen.current.handleOpen();
    }

    // 삭제 진행
    function deleteProcess (){
        
        console.log('삭제진행 id :', deleteId)
        console.log('삭제 전  :', myLotto)

        //@ts-ignore
        const index = myLotto.findIndex(x => x.id === deleteId);
        if (index !== undefined) myLotto.splice(index, 1);
        console.log('삭제 후  :', myLotto)

        if(storeData(constant.LOTTO_KEY, JSON.stringify(myLotto))) {
            console.log('SAVE SUCCESS');
            retrieveData(constant.LOTTO_KEY);
        }
    }

    // 저장
    const storeData = async (key: string, value: any) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('::: AsyncStorage set ERROR !! ')
            return false
        }
    
        return true
    };
    function emptyView () {
        if(myLotto.length === 0 ) {
            return (
                <View style={styles.lottoCard}>
                    <View style={{paddingTop:20, paddingLeft:20} }>
                        <Text style={{fontSize: 18, fontFamily: "NanumMyeongjo",color:'#868e96'}}>
                            아직 보관된 아이템이 없습니다.
                        </Text>
                    </View>
                </View>
            )
        }
    }


    return (
        <View style={styles.all}>
            <View style={styles.header}>
                <View style={styles.backBtn}>
                    <Back onPress={() => {
                        if(clickSafe.safeClicked()) props.navigation.goBack({key: 'MainPage'})
                    }} />
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.mainTitle}>
                    <Text style={styles.titleText}>보관함</Text>
                </View>
                <View style={styles.subTitle}>
                    <Text style={styles.subText}>추출한 해몽 숫자를 보관하는 곳입니다.</Text>
                </View>
                <View style={styles.bodyContents}>
                    {emptyView()}
                    <FlatList 
                        showsHorizontalScrollIndicator={false}
                        horizontal={false}
                        keyExtractor={(item, index) => String(item.id)}
                        data={myLotto}
                        renderItem={({item}) => 
                        <View style={styles.lottoCard}>
                            <LottoCardGroup name={item.name} status={item.status} date={item.date} numbers={item.numbers} id={item.id} delete={deleteItem} detail={detailItem}/>
                        </View>
                        }
                        />
                </View>
            </View>
            <DeleteModal title='정말 이 번호를 삭제하시겠습니까?' ref={modalOpen} action={deleteProcess}/>
        </View>
    )
}

const styles = StyleSheet.create({
    all: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: "#E5E5E5"
    },
    header: {
        flex: 1,
        padding: 20,
        flexDirection: "row"
    },
    body: {
        flex: 11,
        justifyContent: 'center',
        
    },
    backBtn: {
        paddingLeft:5,
        height: 50,
        width: 50
    },
    settingButton: {
        height: 50,
        width: 50
    },
    titleText: {
        fontSize: 40,
        fontFamily: "NanumMyeongjo",
    },
    mainTitle: {
        paddingLeft:40
    },
    subTitle: {
        paddingLeft:40,
        paddingTop:20
    },
    subText: {
        fontFamily: "NanumMyeongjo",
        fontSize: 15,
        paddingTop:5,
    },
    bodyTitle: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingBottom: 50
    },
    bodyContents: {
        flex: 7,
        padding: 10,
        paddingTop:50, 
    },
    lottoCard: {
        height: 160 ,
        backgroundColor: '#ced4da',
        borderRadius: 19,
        marginBottom: 5
    },
    button: {
        width: 120,
        height: 40,
        alignItems: 'center',
        backgroundColor: 'gray',
        justifyContent: 'center',
        borderRadius: 10
    },
    title: {
        fontSize: 15
    },
});

export default MyLotto;
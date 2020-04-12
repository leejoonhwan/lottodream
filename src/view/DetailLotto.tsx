import React , {useState, useRef,useEffect }from 'react'
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    BackHandler,
    TextInputSubmitEditingEventData,
    NativeSyntheticEvent,
    TouchableOpacity,
} from 'react-native';


import SaveModal from '../component/modal/SaveNumbers';
import moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage';
import El from '../../assets/svg/el.svg';
import NumberCard from './number_result/NumberCard'
import BackModal from '../component/modal/BackWarning';
import nextId from "react-id-generator";
import Back from '../../assets/svg/back.svg' ;
import BasicWarning from '../component/modal/BasicWarning';
const clickSafe =require('../util/click_safe')
const constant = require('../util/Constant')


const DetailLotto = (props : any) => {
    useEffect(() => {
        //@ts-ignore
        Text.defaultProps = Text.defaultProps || {};     Text.defaultProps.allowFontScaling = false;

        //@ts-ignore
        TextInput.defaultProps = TextInput.defaultProps || {};     TextInput.defaultProps.allowFontScaling = false;
    }, [])
    const [value, onChangeText] = useState('');
    const [fixName, setFixName] = useState(false);
    const [dateTitle, setDateTitle] = useState('')
    const [nowDate, setNowDate] = useState('')
    const modalOpen = useRef()
    const [dreamName, setDreamName] = useState('')
    const backModalOpen = useRef()
    const modalAlertOpen = useRef();
    const [title, setTitle] = useState('')
    const [params, setParams] = useState([])
    const onClick = () => {
        if(value.length !==0) {
            if(props.route.params.name !== value) props.route.params.update(props.route.params.id, value);
            return props.navigation.goBack();
        }
        //@ts-ignore
        Alert.alert('꿈 이름이 필요합니다.')
    };

    function changeText(text : string) {
        onChangeText(text)
    }
    useEffect( () => {
        // 화면에 표시할 데이트 포멧
        
        let date = props.route.params.date.split(' ');
        let token = date[0].split('.')
        setDateTitle(token[0]+'년 '+token[1]+'월 '+token[2]+'일')
        
        onChangeText(props.route.params.name)

        // array 복사
        let cWords = JSON.parse(JSON.stringify(props.route.params.words))
        let params = []

        // 단어 길이조절
        for(var i in cWords) {

            if(i === '6') {
                params.push({
                    'number' : props.route.params.nums[i],
                    'word' : '보너스'
                })
            }else {
                cWords[i] = cWords[i].replace(/ /g,"")
                if(cWords[i].length >= 6){
                    let index = 4;
                    if(cWords[i].length === 6) index = 3;
                    cWords[i] = [cWords[i].slice(0, index), '\n ', cWords[i].slice(index)].join('');
                }
    
                params.push({
                    'number' : props.route.params.nums[i],
                    'word' : cWords[i]
                })
            }
            
        }
        //@ts-ignore
        setParams(params)

    }, [])
    
    function fixNameProc () {
        if(value.length === 0) {
            setTitle('꿈 이름을 한 글자 이상 입력하세요.')
            //@ts-ignore
            modalAlertOpen.current.handleOpen();
            return 
        }

        setFixName(!fixName)
    }

    // 꿈이름
    function dreamNameView () {
        if(fixName) return (
            <View style={{ borderBottomColor: '#868e96', borderBottomWidth: 1}}>    
                <TextInput
                    style={styles.editBox}
                    editable
                    autoFocus
                    maxLength={10}
                    numberOfLines={1}
                    onChangeText={(text:string) => changeText(text)}
                    onSubmitEditing={(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
                        fixNameProc()}}
                    value={value} />
            </View>
        )
    
        return (
            <TouchableOpacity activeOpacity={1} onPress = { () => setFixName(!fixName)}>
                <Text style={styles.titleText}>{value}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.all}>
            <View style={styles.header}>
                <View style={styles.backBtn}>
                    <Back onPress={() => {
                        if(clickSafe.safeClicked()) onClick()
                    }} />
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.mainTitle}>
                    {dreamNameView()}
                </View>
                <View style={styles.subTitle}>
                    < Text style={styles.todayTitle}>{dateTitle}</Text>
                </View>
                <View style={styles.cardSet}>
                    <View style={styles.eltop}>
                        <View>
                            <El/>
                        </View>
                        <View style={{ transform: [{ rotate: "90deg" }]}}>
                            <El/>
                        </View>
                    </View>
                    <NumberCard params={params}/>
                    <View style={styles.eltop}>
                        <View style={{ transform: [{ rotate: "270deg" }]}}>
                            <El/>
                        </View>
                        <View style={{ transform: [{ rotate: "180deg" }]}}>
                            <El/>
                        </View>
                    </View>

                </View>
            </View>
            <BasicWarning title={title} ref= {modalAlertOpen}/>
        </View>
    )
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },    
    text: {
        color: "black",
        fontSize: 22
    },
    all: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: "#E5E5E5"
    },
    header: {
        flex: 1,
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        flexDirection: "row"
    },
    body: {
        flex: 15,
        paddingBottom: 40
    },
    menuBtn: {
        paddingLeft:20,
        height: 50,
        width: 50
    },
    mainTitle: {
        paddingLeft:40,
        paddingRight: 40
    },
    titleText: {
        fontFamily: "NanumMyeongjo",
        fontSize: 32,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
        flex: 2,
    },
    todayView: {
        paddingLeft:10,
        height: 50,
        width: 300
    },
    todayTitle: {
        fontFamily: "NanumMyeongjo",
        fontSize: 18,
    },
    button: {
        fontFamily: "NanumMyeongjo",
        fontSize: 20,
    },
    rectangle: {
        borderWidth: 1,
        borderBottomColor: '#383838',
        borderLeftColor: '#00ff0000',
        borderTopColor: '#00ff0000',
        borderRightColor: '#00ff0000',
        width: 80,
        height: 30,
        backgroundColor: '#E5E5E5',
    },
    cardSet : {
        flex: 1,
        marginLeft: 30,
        marginRight: 30,
        paddingTop: 40,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    eltop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    backBtn: {
        flex:1,
        paddingLeft:10,
    },
    editBox : {
        fontFamily: "NanumMyeongjo",
        fontSize: 25,
        color : '#868e96'
    },
    subTitle: {
        paddingLeft: 40,
        paddingTop: 20
    },
    subText: {
        fontFamily: "NanumMyeongjo",
        fontSize: 13,
        paddingTop: 5
    },
});

export default DetailLotto;
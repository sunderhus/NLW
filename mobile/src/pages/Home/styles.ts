import styled, { css } from 'styled-components/native'
import { RectButton } from 'react-native-gesture-handler';
import { PickerProps } from 'react-native';


export const Container = styled.ImageBackground`
    flex:1;
    padding:32px;
`;

export const Main = styled.View`
    flex:1;
    justify-content:center;

`
export const Logo = styled.Image`
`

export const Title = styled.Text`
    color: #322153;
    font-family:'Ubuntu_700Bold';
    font-size: 32px;
    max-width: 260px;
    margin-top: 64px;
`
export const Description = styled.Text`
    color: #6C6C80;
    font-family:'Roboto_400Regular';
    font-size: 16px;
    margin-top: 16px;
    line-height:24px;
    max-width: 260px;
`

export const Footer = styled.View`

`
export const Input = styled.TextInput`
    height:60px;
    background:#fff;
    border-radius:10px;
    margin-bottom:8px;
    padding:0px 24px;
    font-size:16px;
    font-family:'Roboto_400Regular';

`

export const Select = styled.Picker`
    height: 60px;
    background-color: #fff;
    margin-bottom: 8px;
`

export const FooterButton = styled(RectButton)`
    background-color:#34cb79;
    height:60px;
    flex-direction:row;
    border-radius:10px;
    overflow:hidden;
    align-items:center;
    margin-top:8px;
    
`
export const FooterButtonIcon = styled.View`
  height:60px;
  width:60px;
  background-color:rgba(0,0,0,0.1);
  justify-content:center;
  align-items:center;
`
export const FooterButtonText = styled.Text`
   flex:1;
   justify-content:center;
   text-align:center;
   color:#fff;
   font-family: 'Roboto_500Medium';
   font-size:16px;
`
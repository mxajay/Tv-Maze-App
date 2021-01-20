import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Spinner from './Spinner';
var s = require('../css/Style');

export default class CustomModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalData: {},
      marginLeft: wp('-50%'), // DEFINE INTIAL VALUE
      marginTop: hp('-50%'), // DEFINE INTIAL VALUE
      voucherAmount: this.props.offerAmount ? this.props.offerAmount : null,
      redeemedPointCashback: this.props.offerPoints
        ? this.props.offerPoints
        : null,
    };
    this.setModalData(
      'voucherAmount',
      this.props.offerAmount ? this.props.offerAmount : 0,
    );
    this.setModalData(
      'redeemedPointCashback',
      this.props.offerPoints ? this.props.offerPoints : 0,
    );
  }

  setModalData(key, value) {
    let tempObj = this.state.modalData;
    tempObj[key] = value;
    this.setState({modalData: tempObj});
  }

  async setMerchantPinState(flag, key, val, nativeEvent = null) {
    if (flag == 1 && val && !nativeEvent) {
      await this.setModalData(key, val);
      switch (key) {
        case 'merPin1':
          this.merPin2.focus();
          break;
        case 'merPin2':
          this.merPin3.focus();
          break;
        case 'merPin3':
          this.merPin4.focus();
          break;
        default:
          console.warn('Do Nothing');
          break;
      }
    } else {
      if (nativeEvent && nativeEvent.key === 'Backspace') {
        await this.setModalData(key, val);
        switch (key) {
          case 'merPin2':
            this.merPin1.focus();
            break;
          case 'merPin3':
            this.merPin2.focus();
            break;
          case 'merPin4':
            this.merPin3.focus();
            break;
          default:
            console.warn('Do Nothing');
            break;
        }
      }
    }
  }

  isValid(action, toValidate = null) {
    const {modalData} = this.state;
    let onlyNoReg = /^[0-9]*$/;
    if (action == 'stamp') {
      if (!modalData.amount) {
        Alert.alert('Invalid', 'Please enter invoice amount');
        return false;
      } else if (onlyNoReg.test(modalData.amount) == false) {
        Alert.alert('Invalid', 'Please enter valid amount');
        return false;
      }
      // else if (
      //   this.props.availblePrice &&
      //   modalData.amount > this.props.availblePrice
      // ) {
      //   Alert.alert(
      //     'Invalid',
      //     'Entered amount should not be greater than offer price',
      //   );
      //   return false;
      // }
      else if (!modalData.inviceNo) {
        Alert.alert('Invalid', 'Please enter invoice number');
        return false;
      } else if (
        toValidate == 'redeemCashVoucher' ||
        toValidate == 'redeemCashback'
      ) {
        if (toValidate == 'redeemCashVoucher') {
          if (modalData.voucherAmount > modalData.amount) {
            Alert.alert(
              'Invalid',
              'Invoice amount should not be less than voucher amount',
            );
            return false;
          }
        } else {
          if (!modalData.redeemedPointCashback) {
            Alert.alert('Invalid', 'Please enter cash amount.');
            return false;
          } else if (modalData.redeemedPointCashback > this.props.offerPoints) {
            Alert.alert(
              'Invalid',
              'Entered cash amount should not be greater than available cash amount.',
            );
            return false;
          } else if (
            !modalData.voucherAmount &&
            toValidate != 'redeemCashback'
          ) {
            Alert.alert('Invalid', 'Please enter voucher amount');
            return false;
          }
        }
      }
      if (
        !modalData.merPin1 ||
        !modalData.merPin2 ||
        !modalData.merPin3 ||
        !modalData.merPin4
      ) {
        Alert.alert('Invalid', 'Please enter the valid outlet pin');
        return false;
      }
    }
    return true;
  }

  stampNow(action, feedbackID = null) {
    if (
      this.props.fromScreen == 'cashback' &&
      action != 'close' &&
      action != 'feedback'
    ) {
      if (this.props.actionToTake) {
        if (this.isValid(action, 'redeemCashback')) {
          this.props.onStampNow('redeemCashback', this.state.modalData);
        }
      } else {
        if (this.isValid(action)) {
          this.props.onStampNow('earnCashback', this.state.modalData);
        }
      }
    } else if (
      this.props.fromScreen == 'cashVoucher' &&
      action != 'close' &&
      action != 'feedback'
    ) {
      if (this.props.actionToTake) {
        if (this.isValid(action, 'redeemCashVoucher')) {
          this.props.onStampNow('redeemCashVoucher', this.state.modalData);
        }
      } else {
        if (this.isValid(action)) {
          this.props.onStampNow('earnCashVoucher', this.state.modalData);
        }
      }
    } else {
      if (action === 'close') {
        this.props.onStampNow(action, false);
      } else if (action === 'closeFeedback') {
        this.props.onStampNow(action, feedbackID);
      } else if (action === 'stamp') {
        if (this.isValid(action)) {
          this.props.onStampNow(action, this.state.modalData);
        }
      } else if (action === 'feedback') {
        this.props.onStampNow(action, feedbackID);
      }
    }
  }

  getButtonName() {
    if (
      this.props.fromScreen &&
      this.props.fromScreen == 'cashVoucher' &&
      !this.props.actionToTake
    ) {
      return 'ISSUE NOW';
    } else if (
      this.props.fromScreen &&
      this.props.fromScreen == 'cashVoucher' &&
      this.props.actionToTake
    ) {
      return 'REDEEM NOW';
    } else if (
      this.props.fromScreen &&
      this.props.fromScreen == 'cashback' &&
      !this.props.actionToTake
    ) {
      return 'CASHBACK';
    } else if (
      this.props.fromScreen &&
      this.props.fromScreen == 'cashback' &&
      this.props.actionToTake
    ) {
      return 'REDEEM NOW';
    } else {
      return 'STAMP';
    }
  }

  getViewSize(event) {
    var {x, y, width, height} = event.nativeEvent.layout;
    let margnLeft = width / 2;
    let margnTop = height / 2;
    this.setState({marginLeft: margnLeft, marginTop: margnTop});
  }

  toNextInput() {
    if (this.props.actionToTake && this.props.fromScreen == 'cashVoucher') {
      this.voucherAmount.focus();
    } else if (this.props.actionToTake && this.props.fromScreen == 'cashback') {
      this.redeemedPointCashback.focus();
    } else {
      this.merPin1.focus();
    }
    return;
  }

  render() {
    if (this.props.toShow == 'stamp') {
      return (
        // STAMP MODAL  // STAMP MODAL  // STAMP MODAL  // STAMP MODAL  // STAMP MODAL
        <Modal animationType="slide" transparent={true}>
          <Spinner spinner={this.props.spinner} />
          <View style={[s.modalWrap]}>
            <View style={[s.modelContent]}>
              <View style={[s.closeModal]}>
                <TouchableOpacity onPress={() => this.stampNow('close')}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={require('../assets/images/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView>
                <View style={[s.modalInputGroup]}>
                  <View style={[s.inputWrap, s.popupInputWrap]}>
                    <Text style={[s.modalInputTite]}>Enter Amount</Text>
                    <Text style={[s.modalCrIcon]}>
                      {this.props.currencyTitle
                        ? this.props.currencyTitle
                        : '$'}
                    </Text>

                    <TextInput
                      placeholderTextColor="#aaa"
                      style={[s.inputField, s.pupupInputField]}
                      onSubmitEditing={() => {
                        this.inviceNo.focus();
                      }}
                      returnKeyLabel="Next"
                      returnKeyType={Platform.OS == 'ios' ? 'done' : 'next'}
                      onChangeText={amount =>
                        this.setModalData('amount', amount)
                      }
                      keyboardType="name-phone-pad"
                      placeholder="29"
                    />
                  </View>
                  <View style={[s.inputWrap, s.popupInputWrap]}>
                    <Text style={[s.modalInputTite]}>Enter Invoice Number</Text>
                    <TextInput
                      placeholderTextColor="#aaa"
                      style={[
                        s.inputField,
                        s.pupupInputField,
                        {paddingLeft: 25},
                      ]}
                      ref={input => {
                        this.inviceNo = input;
                      }}
                      onSubmitEditing={() => {
                        this.toNextInput();
                      }}
                      returnKeyLabel="Next"
                      returnKeyType={Platform.OS == 'ios' ? 'done' : 'next'}
                      onChangeText={inviceNo =>
                        this.setModalData('inviceNo', inviceNo)
                      }
                      keyboardType="name-phone-pad"
                      placeholder="0123456"
                    />
                  </View>
                  {this.props.actionToTake ? (
                    <>
                      <View style={[s.inputWrap, s.popupInputWrap]}>
                        <Text style={[s.modalInputTite]}>
                          {this.props.fromScreen &&
                          this.props.fromScreen == 'cashback'
                            ? 'Cash Amount'
                            : 'Redeemed Points'}
                        </Text>

                        <TextInput
                          placeholderTextColor="#aaa"
                          style={[
                            s.inputField,
                            s.pupupInputField,
                            {paddingLeft: 25},
                          ]}
                          editable={
                            this.props.fromScreen &&
                            this.props.fromScreen == 'cashback'
                              ? true
                              : false
                          }
                          ref={input => {
                            this.redeemedPointCashback = input;
                          }}
                          onChangeText={redeemedPointCashback => {
                            this.setState(
                              {
                                redeemedPointCashback: redeemedPointCashback,
                              },
                              this.setModalData(
                                'redeemedPointCashback',
                                redeemedPointCashback,
                              ),
                            );
                          }}
                          onSubmitEditing={() => {
                            this.props.actionToTake &&
                            this.props.actionToTake == 'cashbackRedeemNow'
                              ? this.merPin1.focus()
                              : this.voucherAmount.focus();
                          }}
                          returnKeyLabel="Next"
                          returnKeyType={Platform.OS == 'ios' ? 'done' : 'next'}
                          keyboardType="name-phone-pad"
                          value={
                            this.state.redeemedPointCashback
                              ? this.state.redeemedPointCashback.toString()
                              : ''
                          }
                          placeholder="200"
                        />
                      </View>
                      {this.props.actionToTake == 'redeemNow' ? (
                        <View style={[s.inputWrap, s.popupInputWrap]}>
                          <Text style={[s.modalInputTite]}>Voucher Amount</Text>
                          <TextInput
                            placeholderTextColor="#aaa"
                            style={[
                              s.inputField,
                              s.pupupInputField,
                              {paddingLeft: 25},
                            ]}
                            editable={
                              this.props.fromScreen &&
                              this.props.fromScreen == 'cashback'
                                ? true
                                : false
                            }
                            ref={input => {
                              this.voucherAmount = input;
                            }}
                            onSubmitEditing={() => {
                              this.merPin1.focus();
                            }}
                            returnKeyLabel="Next"
                            returnKeyType={
                              Platform.OS == 'ios' ? 'done' : 'next'
                            }
                            onChangeText={voucherAmount => {
                              this.setModalData('voucherAmount', voucherAmount);
                            }}
                            keyboardType="name-phone-pad"
                            value={
                              this.state.voucherAmount
                                ? this.state.voucherAmount.toString()
                                : ''
                            }
                            placeholder="20"
                          />
                        </View>
                      ) : (
                        <View />
                      )}
                    </>
                  ) : (
                    <View />
                  )}

                  {this.props.delightInput == '1' ? (
                    <View style={[s.inputWrap, s.popupInputWrap]}>
                      <Text style={[s.modalInputTite]}>Enter CRZ Credits</Text>
                      <TextInput
                        placeholderTextColor="#aaa"
                        style={[
                          s.inputField,
                          s.pupupInputField,
                          {paddingLeft: 25},
                        ]}
                        ref={input => {
                          this.voucherAmount = input;
                        }}
                        onSubmitEditing={() => {
                          this.merPin1.focus();
                        }}
                        returnKeyLabel="Next"
                        returnKeyType={Platform.OS == 'ios' ? 'done' : 'next'}
                        // onChangeText={delightPoint =>
                        //   this.setModalData('delightPoint', delightPoint)
                        // }
                        value={this.props.delightBoxPoints.toString()}
                        editable={false}
                        keyboardType="name-phone-pad"
                        // placeholder="20"
                      />
                    </View>
                  ) : (
                    <View />
                  )}

                  <View style={[s.popupPinWrap]}>
                    <Text style={[s.popupPinTitle]}>Enter 4 digit pin</Text>
                    <View style={[s.pupupInputGroup]}>
                      <TextInput
                        placeholderTextColor="#aaa"
                        style={[s.pinInput]}
                        maxLength={1}
                        ref={input => {
                          this.merPin1 = input;
                        }}
                        returnKeyLabel="Next"
                        returnKeyType={Platform.OS == 'ios' ? 'done' : 'next'}
                        onChangeText={merPin1 =>
                          //this.setModalData('merPin1', merPin1)
                          this.setMerchantPinState(1, 'merPin1', merPin1)
                        }
                        onKeyPress={({nativeEvent}) => {
                          this.setMerchantPinState(
                            2,
                            'merPin1',
                            '',
                            nativeEvent,
                          );
                        }}
                        keyboardType="number-pad"
                        placeholder="1"
                      />
                      <TextInput
                        placeholderTextColor="#aaa"
                        style={[s.pinInput]}
                        maxLength={1}
                        ref={input => {
                          this.merPin2 = input;
                        }}
                        onChangeText={merPin2 =>
                          this.setMerchantPinState(1, 'merPin2', merPin2)
                        }
                        onKeyPress={({nativeEvent}) => {
                          this.setMerchantPinState(
                            2,
                            'merPin2',
                            '',
                            nativeEvent,
                          );
                        }}
                        returnKeyLabel="Next"
                        returnKeyType={Platform.OS == 'ios' ? 'done' : 'next'}
                        keyboardType="number-pad"
                        placeholder="2"
                      />
                      <TextInput
                        placeholderTextColor="#aaa"
                        style={[s.pinInput]}
                        maxLength={1}
                        ref={input => {
                          this.merPin3 = input;
                        }}
                        onChangeText={merPin3 =>
                          this.setMerchantPinState(1, 'merPin3', merPin3)
                        }
                        onKeyPress={({nativeEvent}) => {
                          this.setMerchantPinState(
                            2,
                            'merPin3',
                            '',
                            nativeEvent,
                          );
                        }}
                        returnKeyLabel="Next"
                        returnKeyType={Platform.OS == 'ios' ? 'done' : 'next'}
                        keyboardType="number-pad"
                        placeholder="3"
                      />
                      <TextInput
                        placeholderTextColor="#aaa"
                        style={[s.pinInput]}
                        maxLength={1}
                        ref={input => {
                          this.merPin4 = input;
                        }}
                        onChangeText={merPin4 =>
                          this.setMerchantPinState(1, 'merPin4', merPin4)
                        }
                        onKeyPress={({nativeEvent}) => {
                          this.setMerchantPinState(
                            2,
                            'merPin4',
                            '',
                            nativeEvent,
                          );
                        }}
                        returnKeyLabel="Done"
                        returnKeyType="done"
                        keyboardType="number-pad"
                        placeholder="4"
                      />
                    </View>
                  </View>
                  <View style={[s.buttonWrap, s.popupButtonWrap]}>
                    <TouchableOpacity
                      style={[s.button]}
                      onPress={() => this.stampNow('stamp')}>
                      <Text style={[s.buttonTxt]}>{this.getButtonName()}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    }
    // FEEDBACK MODAL // FEEDBACK MODAL // FEEDBACK MODAL // FEEDBACK MODAL // FEEDBACK MODAL
    else {
      return (
        <Modal animationType="slide" transparent={true}>
          <Spinner spinner={this.props.spinner} />
          <View style={[s.modalWrap]}>
            <View style={[s.modelContent]}>
              <View style={[s.closeModal]}>
                <TouchableOpacity onPress={() => this.stampNow('close')}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={require('../assets/images/close.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={[s.pupupSuccessImg]}>
                <Image
                  style={{width: wp('27.77%'), height: hp('10.62%')}}
                  source={require('../assets/images/success.png')}
                />
              </View>
              <Text style={[s.popupThanksTxt]}>Thank You!</Text>
              <Text style={[s.popupRefTxt]}>Your reference Number is</Text>
              <Text style={[s.popupRefTxt]}>{this.props.feedRefrenceNo}</Text>
              <View
                style={{
                  width: '100%',
                  height: 0.3,
                  marginBottom: 20,
                  marginTop: 5,
                }}>
                <Image
                  style={{width: '100%', height: 0.3}}
                  source={require('../assets/images/borderDashed.png')}
                />
              </View>
              <Text style={[s.popupRefTxt]}>Give your feedback!</Text>
              <View style={[s.feedbackWrap]}>
                <TouchableOpacity
                  style={[s.feedback, {width: 40, height: 40}]}
                  onPress={() => this.stampNow('feedback', 1)}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={require('../assets/images/happy.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.feedback, {width: 40, height: 40}]}
                  onPress={() => this.stampNow('feedback', 2)}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={require('../assets/images/normal.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.feedback, {width: 40, height: 40}]}
                  onPress={() => this.stampNow('feedback', 3)}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={require('../assets/images/sad.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={[s.buttonWrap, s.popupButtonWrap]}>
                <TouchableOpacity
                  style={[s.button]}
                  onPress={() =>
                    this.stampNow(
                      this.props.delightInput ? 'closeFeedback' : 'close',
                    )
                  }>
                  <Text style={[s.buttonTxt]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }
  }
}

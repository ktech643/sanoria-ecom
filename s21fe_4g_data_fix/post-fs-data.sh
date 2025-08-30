#!/system/bin/sh
# Fix 4G data connectivity

# Enable data on boot
resetprop persist.data.netmgrd.qos.enable true
resetprop persist.data.df.dev_name rmnet_usb0
resetprop persist.vendor.data.mode concurrent
resetprop persist.data.mode concurrent

# Fix data authentication
resetprop persist.data.df.agg.dl_pkt 10
resetprop persist.data.df.agg.dl_size 4096
resetprop persist.data.df.mux_count 8
resetprop persist.data.df.iwlan_mux 9

# Enable data profiles
resetprop persist.vendor.radio.enable_temp_dds true
resetprop persist.vendor.radio.custom_ecc 1
resetprop persist.vendor.radio.data_ltd_sys_ind 1
resetprop persist.vendor.radio.data_con_rprt 1

# Fix mobile data routing
resetprop persist.data.df.dl_mode 5
resetprop persist.data.df.ul_mode 5
resetprop persist.data.wda_timer 30
resetprop persist.data.df.agg.dl_pad 512

# Enable LTE data
resetprop persist.radio.multisim.config dsds
resetprop persist.vendor.radio.prefer_nsa 1
resetprop persist.vendor.radio.sib16_support 1
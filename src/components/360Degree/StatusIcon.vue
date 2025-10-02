<template>
     <i :class="iconClass"></i>
</template>
 
 <script>
 import { computed } from 'vue';
 export default {
     name: 'StatusIcon',
     props: {
         status: {
             type: String,
             required: true,
             default: 'unknown',
         }
     },
     setup(props) {
         const iconClass = computed(() => {
             switch (props.status) {
                 case 'complete':
                     return 'bi-check-circle-fill icon-complete';
                 case 'pending':
                     return 'bi bi-clock-fill icon-pending';
                 case 'sending':
                     return 'bi bi-info-circle-fill icon-sending';
                 case 'in-progress':
                     return 'bi-check-circle-fill icon-progress';
                 case 'cancelled':
                     return "bi bi-exclamation-circle-fill icon-cancelled";
                 default:
                     return 'bi-question-circle-fill icon-unknown';
             }
         });
 
         return {
             iconClass
         };
     }
 };
 </script>
 
 <style scoped>
 .icon-complete {
     color: #28A745
     ;
 }
 .icon-pending {
     color: 
     #FD7E14;
 }
 .icon-sending {
     color: #17A2B8
     ;
 }

 .icon-progress {
     color: #FFC107
     ;
 }
 .icon-cancelled {
     color: #DC3545
     ;
 }
 .icon-unknown {
     color: grey;
 }
 </style>
 
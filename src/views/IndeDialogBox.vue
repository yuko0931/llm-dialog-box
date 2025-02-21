<template>
  <div class="container">
    <SiderBar />
    <!-- 使用 Sidebar 组件 -->
    <div class="main-wrapper">
      <div class="chat-wrapper">
        <RouterView> </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SiderBar from '@/components/SiderBar.vue'
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;

  .side {
    width: 260px;
    height: 100%;
    background-color: #171717;
    color: #fff;
  }

  .main-wrapper {
    flex: 1 1 0%;
    background-color: #212121;
    color: #fff;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    .chat-wrapper {
      height: calc(100% - 60px);
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-grow: 1;

      .chat-list {
        width: 100%;
        flex: 1 1;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        overflow: auto;
        border: none;

        div {
          width: 100%;
          max-width: 48rem;
        }
      }

      .input-box.fixed {
        position: sticky;
        bottom: 0;
      }

      .input-box {
        width: 100%;
        max-width: 48rem;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        background-color: #212121;

        .tip {
          margin-bottom: 1.75rem;
          font-size: 1.875rem;
          font-weight: 600;
          line-height: 2.25rem;
        }

        .input-wrapper {
          box-sizing: border-box;
          width: 100%;
          padding: 10px;
          border: transparent;
          border-radius: 24px;
          background-color: #292a2d;
          display: flex;
          flex-flow: column nowrap;
          overflow: hidden;

          .filearea-wrapper {
            width: 100%;
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            gap: 8px;
            margin-bottom: 10px;
          }

          .textarea-wrapper {
            width: 100%;
            margin: 0 4px;
            position: relative;

            textarea {
              width: 100%;
              color: rgb(245, 245, 245);
              line-height: 28px;
              font-size: 16px;
              font-family: 'Inter';
              background-color: transparent;
              word-break: break-word;
              white-space: pre-wrap;
            }
          }

          .button-wrapper {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .btn {
              height: 32px;
              width: 32px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
            }

            .stop {
              background-color: rgb(113 113 122);
              border-radius: 50%;
            }

            .box {
              width: 12px;
              height: 12px;
              margin: 1px;
              background: #ccc;
            }

            .attach {
              margin-right: 10px;

              svg {
                width: 23px;
                height: 23px;
              }
            }

            .send.active {
              background-color: #ccc;
            }

            .send {
              color: #4b4b5b;
              background-color: rgb(113 113 122);
              border-radius: 50%;

              svg {
                width: 16px;
                height: 16px;
              }
            }
          }
        }

        .bottom-info {
          color: #737373;
          font-size: 12px;
          padding: 6px 0;
        }
      }
    }
  }
}
</style>
